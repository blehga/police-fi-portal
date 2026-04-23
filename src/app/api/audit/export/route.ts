import { requireTenantAccess } from "@/lib/tenant-session";

export const dynamic = "force-dynamic";

type AuditRow = {
  id: string | number;
  user_id: string | number | null;
  actor_user_id: string | number | null;
  action: string | null;
  entity: string | null;
  entity_id: string | number | null;
  details: unknown;
  created_at: string | Date | null;
};

type AuditDetails = Record<string, unknown>;

const AUTH_ACTIONS = new Set([
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "ACCESS_DENIED",
  "LOGOUT",
]);

const FI_ACTIONS = new Set(["CREATE", "UPDATE", "DELETE"]);

const EXPORTED_DETAIL_KEYS = new Set([
  "tenant",
  "username",
  "reason",
  "permission",
  "route",
  "method",
  "ip",
  "userAgent",
  "changes",
  "fields",
  "changedFields",
]);

function buildTimestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

function sanitizeFilenamePart(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]/g, "-");
}

function csvEscape(value: unknown): string {
  if (value == null) return '""';

  let str: string;

  if (typeof value === "string") {
    str = value;
  } else if (value instanceof Date) {
    str = value.toISOString();
  } else {
    str = JSON.stringify(value);
  }

  return `"${str.replace(/"/g, '""')}"`;
}

function toDetailsObject(details: unknown): AuditDetails {
  if (!details) return {};

  if (typeof details === "object" && !Array.isArray(details)) {
    return details as AuditDetails;
  }

  if (typeof details === "string") {
    try {
      const parsed = JSON.parse(details);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as AuditDetails;
      }
    } catch {
      return { raw: details };
    }

    return { raw: details };
  }

  return { raw: details };
}

function asString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    value instanceof Date
  ) {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function getDetail(details: AuditDetails, key: string): string {
  return asString(details[key]).trim();
}

function toIsoString(value: string | Date | null): string {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return asString(value);

  return date.toISOString();
}

function formatActionLabel(action: string | null): string {
  const normalized = (action ?? "").trim().toUpperCase();
  if (!normalized) return "";

  const labels: Record<string, string> = {
    LOGIN_SUCCESS: "Login Success",
    LOGIN_FAILED: "Login Failed",
    ACCESS_DENIED: "Access Denied",
    LOGOUT: "Logout",
    CREATE: "Create",
    UPDATE: "Update",
    DELETE: "Delete",
  };

  return labels[normalized] ?? normalized.replace(/_/g, " ");
}

function formatEntityLabel(entity: string | null): string {
  const raw = (entity ?? "").trim();
  if (!raw) return "";

  if (raw.toLowerCase() === "ficard") return "FI Card";

  return raw.replace(/_/g, " ");
}

function formatChangedFields(details: AuditDetails): string {
  const changes = details.changes;
  if (changes && typeof changes === "object" && !Array.isArray(changes)) {
    return Object.keys(changes as Record<string, unknown>).join(", ");
  }

  const fields = details.fields;
  if (Array.isArray(fields)) {
    return fields.map((v) => asString(v).trim()).filter(Boolean).join(", ");
  }

  const changedFields = details.changedFields;
  if (Array.isArray(changedFields)) {
    return changedFields.map((v) => asString(v).trim()).filter(Boolean).join(", ");
  }

  return "";
}

function buildSummary(row: AuditRow, details: AuditDetails): string {
  const action = (row.action ?? "").toUpperCase();
  const entity = formatEntityLabel(row.entity) || "record";
  const entityId = asString(row.entity_id).trim();

  const username = getDetail(details, "username");
  const reason = getDetail(details, "reason");
  const permission = getDetail(details, "permission");
  const route = getDetail(details, "route");
  const method = getDetail(details, "method");
  const changedFields = formatChangedFields(details);

  if (action === "LOGIN_SUCCESS") {
    return username
      ? `Successful login for ${username}`
      : "Successful login";
  }

  if (action === "LOGIN_FAILED") {
    if (username && reason) return `Failed login for ${username} (${reason})`;
    if (username) return `Failed login for ${username}`;
    if (reason) return `Failed login (${reason})`;
    return "Failed login";
  }

  if (action === "ACCESS_DENIED") {
    const target = [method, route].filter(Boolean).join(" ") || "protected resource";
    const extras = [
      permission ? `permission=${permission}` : "",
      reason ? `reason=${reason}` : "",
    ]
      .filter(Boolean)
      .join(", ");

    return extras
      ? `Access denied to ${target} (${extras})`
      : `Access denied to ${target}`;
  }

  if (action === "LOGOUT") {
    return username ? `Logout for ${username}` : "Logout";
  }

  if (action === "CREATE") {
    return entityId ? `Created ${entity} ${entityId}` : `Created ${entity}`;
  }

  if (action === "UPDATE") {
    if (entityId && changedFields) {
      return `Updated ${entity} ${entityId} (${changedFields})`;
    }
    if (entityId) return `Updated ${entity} ${entityId}`;
    if (changedFields) return `Updated ${entity} (${changedFields})`;
    return `Updated ${entity}`;
  }

  if (action === "DELETE") {
    return entityId ? `Deleted ${entity} ${entityId}` : `Deleted ${entity}`;
  }

  return [
    formatActionLabel(action),
    entityId ? `${entity} ${entityId}` : formatEntityLabel(row.entity),
  ]
    .filter(Boolean)
    .join(" ");
}

function getEventCategory(action: string | null): "AUTH" | "FI" | "OTHER" {
  const normalized = (action ?? "").toUpperCase();

  if (AUTH_ACTIONS.has(normalized)) return "AUTH";
  if (FI_ACTIONS.has(normalized)) return "FI";
  return "OTHER";
}

function buildExtraDetails(details: AuditDetails): string {
  const extraEntries = Object.entries(details).filter(
    ([key]) => !EXPORTED_DETAIL_KEYS.has(key)
  );

  if (!extraEntries.length) return "";

  try {
    return JSON.stringify(Object.fromEntries(extraEntries));
  } catch {
    return "";
  }
}

export async function GET(req: Request) {
  try {
    const access = await requireTenantAccess("AUDIT_READ");

    if (!access.ok) {
      return new Response(access.error ?? "Forbidden", {
        status: access.status,
      });
    }

    const { db } = access;
    const { searchParams } = new URL(req.url);

    const entity = (searchParams.get("entity") ?? "").trim();
    const entityId = (searchParams.get("entityId") ?? "").trim();
    const actorUserId = (searchParams.get("actorUserId") ?? "").trim();
    const action = (searchParams.get("action") ?? "").trim().toUpperCase();

    let caseNumber: string | null = null;

    if (entity === "ficard" && entityId) {
      try {
        const [caseRows]: any = await db.query(
          `
          SELECT caseNumber
          FROM ficard
          WHERE id = ?
          LIMIT 1
          `,
          [entityId]
        );

        caseNumber = caseRows?.[0]?.caseNumber ?? null;
      } catch (err) {
        console.error("Failed to fetch caseNumber for export", err);
      }
    }

    const whereParts: string[] = [];
    const whereParams: any[] = [];

    if (entity) {
      whereParts.push("entity = ?");
      whereParams.push(entity);
    }

    if (entityId) {
      whereParts.push("entity_id = ?");
      whereParams.push(entityId);
    }

    if (actorUserId) {
      whereParts.push("actor_user_id = ?");
      whereParams.push(actorUserId);
    }

    if (action) {
      whereParts.push("action = ?");
      whereParams.push(action);
    }

    const whereSql = whereParts.length
      ? `WHERE ${whereParts.join(" AND ")}`
      : "";

    const [rows]: any = await db.query(
      `
      SELECT
        id,
        user_id,
        actor_user_id,
        action,
        entity,
        entity_id,
        details,
        created_at
      FROM audit_log
      ${whereSql}
      ORDER BY created_at DESC, id DESC
      `,
      whereParams
    );

    const header = [
      "id",
      "created_at",
      "event_category",
      "action",
      "action_label",
      "entity",
      "entity_label",
      "entity_id",
      "user_id",
      "actor_user_id",
      "tenant",
      "username",
      "reason",
      "permission",
      "route",
      "method",
      "ip",
      "user_agent",
      "changed_fields",
      "summary",
      "details_json",
    ];

    const lines = [
      header.join(","),
      ...(rows ?? []).map((row: AuditRow) => {
        const details = toDetailsObject(row.details);

        const tenant = getDetail(details, "tenant");
        const username = getDetail(details, "username");
        const reason = getDetail(details, "reason");
        const permission = getDetail(details, "permission");
        const route = getDetail(details, "route");
        const method = getDetail(details, "method");
        const ip = getDetail(details, "ip");
        const userAgent = getDetail(details, "userAgent");
        const changedFields = formatChangedFields(details);
        const summary = buildSummary(row, details);
        const eventCategory = getEventCategory(row.action);
        const actionLabel = formatActionLabel(row.action);
        const entityLabel = formatEntityLabel(row.entity);
        const extraDetails = buildExtraDetails(details);

        return [
          csvEscape(row.id),
          csvEscape(toIsoString(row.created_at)),
          csvEscape(eventCategory),
          csvEscape((row.action ?? "").toUpperCase()),
          csvEscape(actionLabel),
          csvEscape(row.entity),
          csvEscape(entityLabel),
          csvEscape(row.entity_id),
          csvEscape(row.user_id),
          csvEscape(row.actor_user_id),
          csvEscape(tenant),
          csvEscape(username),
          csvEscape(reason),
          csvEscape(permission),
          csvEscape(route),
          csvEscape(method),
          csvEscape(ip),
          csvEscape(userAgent),
          csvEscape(changedFields),
          csvEscape(summary),
          csvEscape(extraDetails),
        ].join(",");
      }),
    ];

    const csv = lines.join("\n");
    const timestamp = buildTimestamp();

    let filename = "audit-log";

    if (entity) {
      filename += `-${sanitizeFilenamePart(entity)}`;
    }

    if (caseNumber) {
      filename += `-${sanitizeFilenamePart(caseNumber)}`;
    }

    filename += `-${timestamp}.csv`;

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("GET /api/audit/export error:", err);
    return new Response("Failed to export audit logs", { status: 500 });
  }
}