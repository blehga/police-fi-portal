import { NextResponse } from "next/server";
import { requireTenantAccess } from "@/lib/tenant-session";
import { logAudit } from "../../../../../lib/audit/logAudit";

function canViewFi(fi: any, currentUserId: string) {
  return fi.createdById === currentUserId || !!fi.isShared;
}

function canEditFi(fi: any, currentUserId: string) {
  return fi.createdById === currentUserId;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const access = await requireTenantAccess({
      permissionCode: "REPORT_READ",
      req,
      route: `/api/fi/${id}`,
      method: "GET",
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

    const [fiRows]: any = await db.query(
      `
      SELECT
        id,
        caseNumber,
        firstName,
        lastName,
        subjectType,
        incidentType,
        createdById,
        isShared,
        createdAt,
        updatedAt
      FROM ficard
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    const fi = fiRows?.[0];

    if (!fi) {
      return NextResponse.json({ error: "FI not found" }, { status: 404 });
    }

    if (!canViewFi(fi, currentUserId)) {
      return NextResponse.json(
        { error: "You do not have permission to view this FI card" },
        { status: 403 }
      );
    }

    const [photoRows]: any = await db.query(
      `
      SELECT
        id,
        url,
        createdAt
      FROM fiphoto
      WHERE fiCardId = ?
      ORDER BY createdAt ASC
      `,
      [id]
    );

    return NextResponse.json(
      {
        ...fi,
        isShared: !!fi.isShared,
        canEdit: canEditFi(fi, currentUserId),
        photos: photoRows ?? [],
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/fi/[id] error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch FI" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const access = await requireTenantAccess({
      permissionCode: "REPORT_WRITE",
      req,
      route: `/api/fi/${id}`,
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

    const { firstName, lastName, subjectType, incidentType } = await req.json();

    if (!firstName || !lastName || !subjectType || !incidentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      const [beforeRows]: any = await conn.query(
        `
        SELECT
          id,
          caseNumber,
          firstName,
          lastName,
          subjectType,
          incidentType,
          createdById,
          isShared
        FROM ficard
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

      const before = beforeRows?.[0];

      if (!before) {
        await conn.rollback();
        return NextResponse.json({ error: "FI not found" }, { status: 404 });
      }

      if (!canEditFi(before, currentUserId)) {
        await conn.rollback();
        return NextResponse.json(
          { error: "Only the creator can edit this FI card" },
          { status: 403 }
        );
      }

      await conn.query(
        `
        UPDATE ficard
        SET
          firstName = ?,
          lastName = ?,
          subjectType = ?,
          incidentType = ?,
          updatedAt = NOW()
        WHERE id = ?
        `,
        [firstName, lastName, subjectType, incidentType, id]
      );

      const [updatedRows]: any = await conn.query(
        `
        SELECT
          id,
          caseNumber,
          firstName,
          lastName,
          subjectType,
          incidentType,
          createdById,
          isShared,
          createdAt,
          updatedAt
        FROM ficard
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

      const updated = updatedRows?.[0];

      if (!updated) {
        throw new Error("Failed to load updated FI");
      }

      const changes: Record<string, { from: any; to: any }> = {};

      if (before.firstName !== firstName) {
        changes.firstName = { from: before.firstName, to: firstName };
      }

      if (before.lastName !== lastName) {
        changes.lastName = { from: before.lastName, to: lastName };
      }

      if (before.subjectType !== subjectType) {
        changes.subjectType = { from: before.subjectType, to: subjectType };
      }

      if (before.incidentType !== incidentType) {
        changes.incidentType = { from: before.incidentType, to: incidentType };
      }

      await logAudit(conn, {
        userId: null,
        actorUserId: currentUserId,
        action: "UPDATE",
        entity: "ficard",
        entityId: updated.id,
        details: {
          caseNumber: updated.caseNumber,
          changes,
        },
      });

      await conn.commit();

      return NextResponse.json(updated, { status: 200 });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error("PATCH /api/fi/[id] error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update FI" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const access = await requireTenantAccess({
      permissionCode: "REPORT_DELETE",
      req,
      route: `/api/fi/${id}`,
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

      const [existsRows]: any = await conn.query(
        `
        SELECT
          id,
          caseNumber,
          firstName,
          lastName,
          subjectType,
          incidentType,
          createdById,
          isShared
        FROM ficard
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

      const existing = existsRows?.[0];

      if (!existing) {
        await conn.rollback();
        return NextResponse.json(
          { error: "FI record not found" },
          { status: 404 }
        );
      }

      if (!canEditFi(existing, currentUserId)) {
        await conn.rollback();
        return NextResponse.json(
          { error: "Only the creator can delete this FI card" },
          { status: 403 }
        );
      }

      await conn.query(
        `
        DELETE FROM ficard
        WHERE id = ?
        `,
        [id]
      );

      await logAudit(conn, {
        userId: null,
        actorUserId: currentUserId,
        action: "DELETE",
        entity: "ficard",
        entityId: existing.id,
        details: {
          caseNumber: existing.caseNumber,
          firstName: existing.firstName,
          lastName: existing.lastName,
          subjectType: existing.subjectType,
          incidentType: existing.incidentType,
        },
      });

      await conn.commit();

      return NextResponse.json(
        { ok: true, message: "FI deleted successfully" },
        { status: 200 }
      );
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error("DELETE /api/fi/[id] error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete FI" },
      { status: 500 }
    );
  }
}