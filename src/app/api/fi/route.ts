import { NextResponse } from "next/server";
import { requireTenantAccess } from "@/lib/tenant-session";
import { logAudit } from "../../../../lib/audit/logAudit";

function currentYYNum() {
  return Number(new Date().getFullYear().toString().slice(-2));
}

function buildCaseNumber(yearYY: number, seq: number) {
  return `${String(yearYY).padStart(2, "0")}-${String(seq).padStart(4, "0")}`;
}

export async function GET(req: Request) {
  try {
    const access = await requireTenantAccess({
      permissionCode: "REPORT_READ",
      req,
      route: "/api/fi",
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

    const [rows]: any = await db.query(
      `
      SELECT
        f.id,
        f.caseNumber,
        f.yearYY,
        f.seq,
        f.firstName,
        f.lastName,
        f.subjectType,
        f.incidentType,
        f.createdAt,
        f.updatedAt,
        f.createdById,
        f.isShared,
        CASE
          WHEN f.createdById = ? THEN TRUE
          ELSE FALSE
        END AS canEdit
      FROM ficard f
      WHERE f.createdById = ?
         OR f.isShared = TRUE
      ORDER BY f.createdAt DESC, f.id DESC
      `,
      [currentUserId, currentUserId]
    );

    const items = (rows ?? []).map((row: any) => ({
      ...row,
      isShared: !!row.isShared,
      canEdit: !!row.canEdit,
    }));

    return NextResponse.json(
      {
        items,
        total: items.length,
        page: 1,
        pageSize: items.length,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/fi error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch FI list" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const access = await requireTenantAccess({
      permissionCode: "REPORT_WRITE",
      req,
      route: "/api/fi",
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

    const body = await req.json();
    const { firstName, lastName, subjectType, incidentType } = body ?? {};

    if (!firstName || !lastName || !subjectType || !incidentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const yy = currentYYNum();
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      await conn.query(
        `
        INSERT INTO casecounter (\`year\`, \`last\`)
        VALUES (?, 1)
        ON DUPLICATE KEY UPDATE \`last\` = LAST_INSERT_ID(\`last\` + 1)
        `,
        [yy]
      );

      const [seqRows]: any = await conn.query(
        `SELECT LAST_INSERT_ID() AS seq`
      );

      const seq = Number(seqRows?.[0]?.seq ?? 1);
      const caseNumber = buildCaseNumber(yy, seq);

      await conn.query(
        `
        INSERT INTO ficard
          (
            id,
            caseNumber,
            yearYY,
            seq,
            firstName,
            lastName,
            subjectType,
            incidentType,
            createdById,
            isShared,
            createdAt,
            updatedAt
          )
        VALUES
          (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, FALSE, NOW(), NOW())
        `,
        [
          caseNumber,
          yy,
          seq,
          firstName,
          lastName,
          subjectType,
          incidentType,
          currentUserId,
        ]
      );

      const [rows]: any = await conn.query(
        `
        SELECT
          id,
          caseNumber,
          yearYY,
          seq,
          firstName,
          lastName,
          subjectType,
          incidentType,
          createdById,
          isShared,
          createdAt,
          updatedAt
        FROM ficard
        WHERE caseNumber = ?
        LIMIT 1
        `,
        [caseNumber]
      );

      const created = rows?.[0];
      if (!created) {
        throw new Error("Failed to load created FI record");
      }

      await logAudit(conn, {
        userId: null,
        actorUserId: currentUserId,
        action: "CREATE",
        entity: "ficard",
        entityId: created.id,
        details: {
          caseNumber: created.caseNumber,
          firstName: created.firstName,
          lastName: created.lastName,
          subjectType: created.subjectType,
          incidentType: created.incidentType,
          createdById: created.createdById,
          isShared: !!created.isShared,
        },
      });

      await conn.commit();

      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error("POST /api/fi error:", err);

    if (err?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Duplicate case number. Please retry." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err?.message || "Server error while creating FI" },
      { status: 500 }
    );
  }
}