import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTenantDbBySlug } from "@/lib/tenant-db";
import { logAudit } from "../../lib/audit/logAudit";

type RequireTenantAccessArgs = {
  tenantSlug?: string;
  permissionCode?: string;
  req?: Request;
  route?: string;
  method?: string;
};

function getRequestIp(req?: Request) {
  if (!req) return null;

  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null
  );
}

function getUserAgent(req?: Request) {
  if (!req) return null;
  return req.headers.get("user-agent") ?? null;
}

export async function requireTenantAccess(
  arg?: string | RequireTenantAccessArgs
) {
  const permissionCode =
    typeof arg === "string" ? arg : arg?.permissionCode;

  const requestedTenantSlug =
    typeof arg === "string"
      ? undefined
      : arg?.tenantSlug?.trim().toLowerCase();

  const req = typeof arg === "string" ? undefined : arg?.req;
  const route = typeof arg === "string" ? undefined : arg?.route;
  const method = typeof arg === "string" ? undefined : arg?.method;

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        ok: false as const,
        status: 401,
        error: "Unauthorized",
      };
    }

    const sessionTenantRaw = (session as any).tenant;
    const sessionTenant =
      typeof sessionTenantRaw === "string"
        ? sessionTenantRaw.trim().toLowerCase()
        : "";

    if (!sessionTenant) {
      return {
        ok: false as const,
        status: 400,
        error: "Missing tenant in session",
      };
    }

    const tenantDb = await getTenantDbBySlug(sessionTenant);
    const db = tenantDb.db;

    const userId = (session as any)?.user?.id ?? (session as any)?.id ?? null;
    const username =
      (session as any)?.username ??
      (session as any)?.user?.name ??
      null;

    if (!userId) {
      return {
        ok: false as const,
        status: 401,
        error: "Invalid session",
      };
    }

    if (requestedTenantSlug && requestedTenantSlug !== sessionTenant) {
      const conn = await db.getConnection();

      try {
        await logAudit(conn, {
          userId: null,
          actorUserId: String(userId),
          action: "ACCESS_DENIED",
          entity: "auth",
          entityId: String(userId),
          details: {
            tenant: sessionTenant,
            username,
            reason: "TENANT_MISMATCH",
            requestedTenant: requestedTenantSlug,
            sessionTenant,
            permission: permissionCode ?? null,
            route: route ?? null,
            method: method ?? null,
            ip: getRequestIp(req),
            userAgent: getUserAgent(req),
          },
        });
      } catch (err) {
        console.error("ACCESS_DENIED audit failed:", err);
      } finally {
        conn.release();
      }

      return {
        ok: false as const,
        status: 403,
        error: "Tenant mismatch",
      };
    }

    const [userRows]: any = await db.query(
      `
      SELECT id, username, isActive, sessionVersion
      FROM user
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    );

    const user = userRows?.[0];

    if (!user) {
      return {
        ok: false as const,
        status: 401,
        error: "User not found",
      };
    }

    if (!user.isActive) {
      const conn = await db.getConnection();

      try {
        await logAudit(conn, {
          userId: null,
          actorUserId: String(user.id),
          action: "ACCESS_DENIED",
          entity: "auth",
          entityId: String(user.id),
          details: {
            tenant: sessionTenant,
            username: user.username ?? username,
            reason: "USER_INACTIVE",
            permission: permissionCode ?? null,
            route: route ?? null,
            method: method ?? null,
            ip: getRequestIp(req),
            userAgent: getUserAgent(req),
          },
        });
      } catch (err) {
        console.error("ACCESS_DENIED audit failed:", err);
      } finally {
        conn.release();
      }

      return {
        ok: false as const,
        status: 403,
        error: "User inactive",
      };
    }

    const sessionVersion = Number((session as any).sessionVersion ?? 1);

    if (Number(user.sessionVersion ?? 1) !== sessionVersion) {
      return {
        ok: false as const,
        status: 401,
        error: "Session expired",
      };
    }

    const permissions = Array.isArray((session as any).permissions)
      ? (session as any).permissions
      : [];

    if (permissionCode && !permissions.includes(permissionCode)) {
      const conn = await db.getConnection();

      try {
        await logAudit(conn, {
          userId: null,
          actorUserId: String(user.id),
          action: "ACCESS_DENIED",
          entity: "auth",
          entityId: String(user.id),
          details: {
            tenant: sessionTenant,
            username: user.username ?? username,
            reason: "MISSING_PERMISSION",
            permission: permissionCode,
            route: route ?? null,
            method: method ?? null,
            ip: getRequestIp(req),
            userAgent: getUserAgent(req),
          },
        });
      } catch (err) {
        console.error("ACCESS_DENIED audit failed:", err);
      } finally {
        conn.release();
      }

      return {
        ok: false as const,
        status: 403,
        error: "Forbidden",
      };
    }

    return {
      ok: true as const,
      session,
      tenant: sessionTenant,
      db,
      organizationId: tenantDb.organizationId,
      userId: String(user.id),
    };
  } catch (err) {
    console.error("requireTenantAccess error:", err);

    return {
      ok: false as const,
      status: 500,
      error: "Failed to verify tenant access",
    };
  }
}