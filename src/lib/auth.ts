import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getTenantDbBySlug } from "@/lib/tenant-db";
import { logAudit } from "../../lib/audit/logAudit";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        tenant: { label: "Tenant", type: "text" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(creds, req) {
        console.log("LOGIN FLOW HIT");

        const tenantSlug = String(creds?.tenant ?? "").trim().toLowerCase();
        const username = String(creds?.username ?? "").trim();
        const password = String(creds?.password ?? "");

        const forwardedFor =
          req?.headers?.["x-forwarded-for"] ||
          req?.headers?.["X-Forwarded-For"];

        const ip = Array.isArray(forwardedFor)
          ? forwardedFor[0]
          : typeof forwardedFor === "string"
            ? forwardedFor.split(",")[0]?.trim()
            : null;

        const userAgent =
          req?.headers?.["user-agent"] ||
          req?.headers?.["User-Agent"] ||
          null;

        if (!tenantSlug || !username || !password) {
          console.log("LOGIN FAIL: MISSING_CREDENTIALS");
          return null;
        }

       let db: any;
let slug: string;
let tenantDbName: string;

try {
  const tenantResult = await getTenantDbBySlug(tenantSlug);
  db = tenantResult.db;
  slug = tenantResult.slug;
  tenantDbName = tenantResult.databaseName;

  console.log("TENANT DB RESOLVED:", slug, tenantDbName);
} catch (err) {
          console.error("LOGIN FAIL: TENANT_DB_LOOKUP_FAILED", err);
          return null;
        }

        const conn = await db.getConnection();

        try {
          const [users]: any = await conn.query(
            `
            SELECT
              id,
              username,
              email,
              firstName,
              lastName,
              badgeId,
              passwordHash,
              isActive,
              sessionVersion
            FROM user
            WHERE username = ? OR email = ?
            LIMIT 1
            `,
            [username, username]
          );

          if (!users.length) {
            await safeAudit(conn, {
              userId: null,
              actorUserId: null,
              action: "LOGIN_FAILED",
              entity: "auth",
              entityId: null,
              details: {
                tenant: slug,
                username,
                reason: "USER_NOT_FOUND",
                ip,
                userAgent,
              },
            });

            return null;
          }

          const user = users[0];

          if (!user.isActive) {
            await safeAudit(conn, {
              userId: null,
              actorUserId: String(user.id),
              action: "LOGIN_FAILED",
              entity: "auth",
              entityId: String(user.id),
              details: {
                tenant: slug,
                username: user.username,
                reason: "USER_INACTIVE",
                ip,
                userAgent,
              },
            });

            return null;
          }

          const ok = await bcrypt.compare(password, user.passwordHash);

          if (!ok) {
            await safeAudit(conn, {
              userId: null,
              actorUserId: String(user.id),
              action: "LOGIN_FAILED",
              entity: "auth",
              entityId: String(user.id),
              details: {
                tenant: slug,
                username: user.username,
                reason: "INVALID_PASSWORD",
                ip,
                userAgent,
              },
            });

            return null;
          }

          const [permRows]: any = await conn.query(
            `
            SELECT DISTINCT p.code
            FROM userrole ur
            JOIN rolepermission rp ON rp.roleId = ur.roleId
            JOIN permission p ON p.id = rp.permissionId
            WHERE ur.userId = ?
            `,
            [user.id]
          );

          const permissions = permRows.map((r: any) => r.code);

          await safeAudit(conn, {
            userId: null,
            actorUserId: String(user.id),
            action: "LOGIN_SUCCESS",
            entity: "auth",
            entityId: String(user.id),
            details: {
              tenant: slug,
              username: user.username,
              ip,
              userAgent,
            },
          });

         return {
  id: String(user.id),
  username: user.username,
  email: user.email ?? undefined,
  firstName: user.firstName ?? null,
  lastName: user.lastName ?? null,
  badgeId: user.badgeId ?? null,
  tenant: slug,
  tenantDbName,
  permissions,
  sessionVersion: Number(user.sessionVersion ?? 1),
};
        } catch (err) {
          console.error("AUTHORIZE ERROR:", err);
          return null;
        } finally {
          conn.release();
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
        token.username = user.username;
        token.firstName = user.firstName ?? null;
        token.lastName = user.lastName ?? null;
        token.badgeId = user.badgeId ?? null;
        token.tenant = user.tenant;
        token.tenantDbName = user.tenantDbName;
        token.permissions = Array.isArray(user.permissions)
          ? user.permissions
          : [];
        token.sessionVersion = Number(user.sessionVersion ?? 1);
      }

      return token;
    },

    async session({ session, token }: any) {
      session.username = token.username ?? session.user?.name;
      session.tenant = token.tenant;
      session.tenantDbName = token.tenantDbName;
      session.permissions = Array.isArray(token.permissions)
        ? token.permissions
        : [];
      session.sessionVersion = Number(token.sessionVersion ?? 1);

      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).firstName = token.firstName ?? null;
        (session.user as any).lastName = token.lastName ?? null;
        (session.user as any).badgeId = token.badgeId ?? null;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

async function safeAudit(conn: any, data: any) {
  try {
    await logAudit(conn, data);
  } catch (err) {
    console.error("LOGIN AUDIT FAILED:", err);
  }
}