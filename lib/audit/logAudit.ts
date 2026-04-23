import type { PoolConnection } from "mysql2/promise";

type AuditAction = string;

type LogAuditInput = {
  userId?: number | null;
  actorUserId?: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | number | null;
  details?: unknown;
};

const SENSITIVE_KEYS = new Set([
  "password",
  "passwordHash",
  "newPassword",
  "oldPassword",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "cookie",
  "secret",
  "apiKey",
  "resetToken",
  "ssn",
]);

function sanitize(value: unknown, depth = 0): unknown {
  if (depth > 5) return "[truncated]";
  if (value == null) return value;

  if (Array.isArray(value)) {
    return value.map((v) => sanitize(v, depth + 1));
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(obj)) {
      if (SENSITIVE_KEYS.has(key)) {
        out[key] = "[redacted]";
      } else {
        out[key] = sanitize(val, depth + 1);
      }
    }

    return out;
  }

  if (typeof value === "string" && value.length > 2000) {
    return `${value.slice(0, 2000)}...[truncated]`;
  }

  return value;
}

export async function logAudit(conn: PoolConnection, input: LogAuditInput) {
  const {
    userId = null,
    actorUserId = null,
    action,
    entity,
    entityId = null,
    details = null,
  } = input;

  await conn.query(
    `
      INSERT INTO audit_log (
        user_id,
        actor_user_id,
        action,
        entity,
        entity_id,
        details
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      actorUserId,
      action,
      entity,
      entityId != null ? String(entityId) : null,
      details != null ? JSON.stringify(sanitize(details)) : null,
    ]
  );
}