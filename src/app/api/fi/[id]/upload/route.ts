import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireTenantAccess } from "@/lib/tenant-session";
import { logAudit } from "../../../../../../lib/audit/logAudit";

export const dynamic = "force-dynamic";

function canEditFi(fi: any, currentUserId: string) {
  return fi.createdById === currentUserId;
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const access = await requireTenantAccess({
      permissionCode: "REPORT_WRITE",
      req,
      route: `/api/fi/${id}/upload`,
      method: "POST",
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

      const [fiRows]: any = await conn.query(
        `
        SELECT
          f.id,
          f.caseNumber,
          f.createdById,
          COUNT(p.id) AS photoCount
        FROM ficard f
        LEFT JOIN fiphoto p
          ON p.fiCardId = f.id
        WHERE f.id = ?
        GROUP BY f.id, f.caseNumber, f.createdById
        LIMIT 1
        `,
        [id]
      );

      const fi = fiRows?.[0];

      if (!fi) {
        await conn.rollback();
        return NextResponse.json({ error: "FI not found" }, { status: 404 });
      }

      if (!canEditFi(fi, currentUserId)) {
        await conn.rollback();
        return NextResponse.json(
          { error: "Only the creator can upload photos to this FI card" },
          { status: 403 }
        );
      }

      const formData = await req.formData();

      const single = formData.get("file") as File | null;
      let many = formData.getAll("files") as File[];

      if (single && many.length === 0) {
        many = [single];
      }

      if (!many || many.length === 0) {
        await conn.rollback();
        return NextResponse.json(
          { error: "No file(s) uploaded" },
          { status: 400 }
        );
      }

      const max = 3;
      const currentCount = Number(fi.photoCount ?? 0);
      const remaining = Math.max(0, max - currentCount);

      if (remaining <= 0) {
        await conn.rollback();
        return NextResponse.json(
          { error: "Max 3 photos allowed" },
          { status: 400 }
        );
      }

      const toProcess = many.slice(0, remaining);

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const created: { id: string; url: string }[] = [];

      for (const file of toProcess) {
        if (!file || !file.type.startsWith("image/")) continue;

        const bytes = Buffer.from(await file.arrayBuffer());
        const safeName = (file.name || "photo.jpg")
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9._-]/g, "");

        const filename = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}-${safeName}`;

        const filepath = path.join(uploadsDir, filename);
        await fs.writeFile(filepath, bytes);

        const url = `/uploads/${filename}`;

        await conn.query(
          `
          INSERT INTO fiphoto (id, fiCardId, url, createdAt)
          VALUES (UUID(), ?, ?, NOW())
          `,
          [id, url]
        );

        const [photoRows]: any = await conn.query(
          `
          SELECT id, url
          FROM fiphoto
          WHERE fiCardId = ?
            AND url = ?
          ORDER BY createdAt DESC
          LIMIT 1
          `,
          [id, url]
        );

        const photo = photoRows?.[0];

        if (photo) {
          created.push({
            id: photo.id,
            url: photo.url,
          });

          await logAudit(conn, {
            userId: null,
            actorUserId: currentUserId,
            action: "CREATE",
            entity: "fiphoto",
            entityId: photo.id,
            details: {
              fiCardId: id,
              caseNumber: fi.caseNumber,
              url: photo.url,
            },
          });
        }
      }

      if (created.length === 0) {
        await conn.rollback();
        return NextResponse.json(
          { error: "No valid images uploaded" },
          { status: 400 }
        );
      }

      await conn.commit();

      return NextResponse.json({ items: created }, { status: 201 });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}