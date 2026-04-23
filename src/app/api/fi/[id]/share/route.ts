import { NextResponse } from "next/server";
import { requireTenantAccess } from "@/lib/tenant-session";
import { logAudit } from "../../../../../../lib/audit/logAudit";

function canEditFi(fi: any, currentUserId: string) {
  return fi.createdById === currentUserId;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const access = await requireTenantAccess({
      permissionCode: "REPORT_WRITE",
      req,
      route: `/api/fi/${params.id}/share`,
      method: "PATCH",
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

    const body = await req.json();
    const isShared = !!body?.isShared;

    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      const [rows]: any = await conn.query(
        `
        SELECT
          id,
          caseNumber,
          createdById,
          isShared
        FROM ficard
        WHERE id = ?
        LIMIT 1
        `,
        [params.id]
      );

      const fi = rows?.[0];

      if (!fi) {
        await conn.rollback();
        return NextResponse.json({ error: "FI not found" }, { status: 404 });
      }

      if (!canEditFi(fi, currentUserId)) {
        await conn.rollback();
        return NextResponse.json(
          { error: "Only the creator can change share status" },
          { status: 403 }
        );
      }

      await conn.query(
        `
        UPDATE ficard
        SET
          isShared = ?,
          updatedAt = NOW()
        WHERE id = ?
        `,
        [isShared, params.id]
      );

      await logAudit(conn, {
        userId: null,
        actorUserId: currentUserId,
        action: "UPDATE",
        entity: "ficard",
        entityId: fi.id,
        details: {
          caseNumber: fi.caseNumber,
          changes: {
            isShared: {
              from: !!fi.isShared,
              to: isShared,
            },
          },
        },
      });

      await conn.commit();

      return NextResponse.json(
        {
          ok: true,
          id: fi.id,
          isShared,
        },
        { status: 200 }
      );
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error("PATCH /api/fi/[id]/share error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update share status" },
      { status: 500 }
    );
  }
}