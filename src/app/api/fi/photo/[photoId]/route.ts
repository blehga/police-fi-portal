import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireTenantAccess } from "@/lib/tenant-session";
import { logAudit } from "../../../../../../lib/audit/logAudit";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: { photoId: string } }
) {
  try {
    const access = await requireTenantAccess({
      permissionCode: "REPORT_DELETE)",
      req,
      route: `/api/fi/photo/${params.photoId}`,
      method: "DELETE",
    });

    if (!access.ok) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status }
      );
    }

    const { db, session } = access;
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      const [photoRows]: any = await conn.query(
        `
        SELECT
          p.id,
          p.url,
          p.fiCardId,
          f.caseNumber,
          f.createdById
        FROM fiphoto p
        INNER JOIN ficard f
          ON f.id = p.fiCardId
        WHERE p.id = ?
        LIMIT 1
        `,
        [params.photoId]
      );

      const photo = photoRows?.[0];
      if (!photo) {
        await conn.rollback();
        return NextResponse.json({ error: "Photo not found" }, { status: 404 });
      }

      if (photo.createdById !== currentUserId) {
        await conn.rollback();
        return NextResponse.json(
          { error: "Only the creator can delete photos from this FI card" },
          { status: 403 }
        );
      }

      const [result]: any = await conn.query(
        `
        DELETE FROM fiphoto
        WHERE id = ?
        `,
        [params.photoId]
      );

      if (!result?.affectedRows) {
        await conn.rollback();
        return NextResponse.json({ error: "Photo not found" }, { status: 404 });
      }

      await logAudit(conn, {
        userId: null,
        actorUserId: currentUserId,
        action: "DELETE",
        entity: "fiphoto",
        entityId: photo.id,
        details: {
          fiCardId: photo.fiCardId,
          caseNumber: photo.caseNumber,
          url: photo.url,
        },
      });

      await conn.commit();

      if (photo.url?.startsWith("/uploads/")) {
        const relativePath = photo.url.replace(/^\/+/, "");
        const fullPath = path.join(process.cwd(), "public", relativePath);

        try {
          await fs.unlink(fullPath);
        } catch {
          // ignore missing file
        }
      }

      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error("DELETE /api/fi/photo/[photoId] error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete photo" },
      { status: 500 }
    );
  }
}