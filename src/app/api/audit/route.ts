import { NextResponse } from "next/server";
import { requireTenantAccess } from "@/lib/tenant-session";

export const dynamic = "force-dynamic";

type AuditRow = {
  id: number;
  user_id: number | null;
  actor_user_id: string | null;
  actor_name: string | null;
  actor_username: string | null;
  actor_role: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  caseNumber: string | null;
  details: any;
  created_at: string;
};

function parseDetails(details: unknown) {
  if (details == null) return null;

  if (typeof details === "string") {
    try {
      return JSON.parse(details);
    } catch {
      return details;
    }
  }

  return details;
}

export async function GET(req: Request) {
  try {
    const access = await requireTenantAccess("AUDIT_READ");

    if (!access.ok) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status }
      );
    }

    const { db } = access;
    const { searchParams } = new URL(req.url);

    const entity = (searchParams.get("entity") ?? "").trim();
    const entityId = (searchParams.get("entityId") ?? "").trim();
    const actor = (searchParams.get("actor") ?? "").trim();
    const action = (searchParams.get("action") ?? "").trim().toUpperCase();

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.max(
      1,
      Math.min(100, Number(searchParams.get("pageSize") ?? 20))
    );
    const offset = (page - 1) * pageSize;

    const whereParts: string[] = [];
    const whereParams: any[] = [];

    if (entity) {
      whereParts.push("a.entity = ?");
      whereParams.push(entity);
    }

    if (entityId) {
      if (entity === "ficard") {
        whereParts.push("(a.entity_id = ? OR f.caseNumber LIKE ?)");
        whereParams.push(entityId, `${entityId}%`);
      } else {
        whereParts.push("a.entity_id = ?");
        whereParams.push(entityId);
      }
    }

    if (actor) {
      whereParts.push(`
        (
          a.actor_user_id = ?
          OR actor.username LIKE ?
          OR actor.firstName LIKE ?
          OR actor.lastName LIKE ?
          OR TRIM(
            CONCAT(
              COALESCE(actor.firstName, ''),
              CASE
                WHEN actor.firstName IS NOT NULL AND actor.lastName IS NOT NULL THEN ' '
                ELSE ''
              END,
              COALESCE(actor.lastName, '')
            )
          ) LIKE ?
        )
      `);
      whereParams.push(
        actor,
        `%${actor}%`,
        `%${actor}%`,
        `%${actor}%`,
        `%${actor}%`
      );
    }

    if (action) {
      whereParts.push("a.action = ?");
      whereParams.push(action);
    }

    const whereSql = whereParts.length
      ? `WHERE ${whereParts.join(" AND ")}`
      : "";

    const [countRows]: any = await db.query(
      `
      SELECT COUNT(DISTINCT a.id) AS total
      FROM audit_log a
      LEFT JOIN ficard f
        ON a.entity = 'ficard'
       AND a.entity_id = f.id
      LEFT JOIN \`user\` actor
        ON actor.id = a.actor_user_id
      ${whereSql}
      `,
      whereParams
    );

    const total = Number(countRows?.[0]?.total ?? 0);

    const [rows]: any = await db.query(
      `
      SELECT
        a.id,
        a.user_id,
        a.actor_user_id,
        TRIM(
          CONCAT(
            COALESCE(actor.firstName, ''),
            CASE
              WHEN actor.firstName IS NOT NULL AND actor.lastName IS NOT NULL THEN ' '
              ELSE ''
            END,
            COALESCE(actor.lastName, '')
          )
        ) AS actor_full_name,
        actor.username AS actor_username,
        (
          SELECT MIN(r.name)
          FROM userrole ur
          INNER JOIN role r
            ON r.id = ur.roleId
          WHERE ur.userId = actor.id
        ) AS actor_role,
        a.action,
        a.entity,
        a.entity_id,
        f.caseNumber AS caseNumber,
        a.details,
        a.created_at
      FROM audit_log a
      LEFT JOIN ficard f
        ON a.entity = 'ficard'
       AND a.entity_id = f.id
      LEFT JOIN \`user\` actor
        ON actor.id = a.actor_user_id
      ${whereSql}
      ORDER BY a.created_at DESC, a.id DESC
      LIMIT ? OFFSET ?
      `,
      [...whereParams, pageSize, offset]
    );

    const items: AuditRow[] = (rows ?? []).map((row: any) => {
      const fullName =
        typeof row.actor_full_name === "string"
          ? row.actor_full_name.trim()
          : "";

      const username =
        typeof row.actor_username === "string"
          ? row.actor_username.trim()
          : "";

      const role =
        typeof row.actor_role === "string"
          ? row.actor_role.trim()
          : "";

      return {
        id: Number(row.id),
        user_id: row.user_id != null ? Number(row.user_id) : null,
        actor_user_id:
          row.actor_user_id != null ? String(row.actor_user_id) : null,
        actor_name: fullName || null,
        actor_username: username || null,
        actor_role: role || null,
        action: String(row.action ?? ""),
        entity: String(row.entity ?? ""),
        entity_id: row.entity_id != null ? String(row.entity_id) : null,
        caseNumber: row.caseNumber != null ? String(row.caseNumber) : null,
        details: parseDetails(row.details),
        created_at:
          row.created_at instanceof Date
            ? row.created_at.toISOString()
            : String(row.created_at ?? ""),
      };
    });

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
    });
  } catch (err: any) {
    console.error("GET /api/audit error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}