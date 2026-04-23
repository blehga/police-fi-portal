import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireTenantAccess } from "@/lib/tenant-session";

export const dynamic = "force-dynamic";

// GET /api/admin/users
export async function GET(req: Request) {
  try {
    const tenantSlug =
      req.headers.get("x-tenant-slug")?.trim().toLowerCase() || undefined;

    const gate = await requireTenantAccess({
      tenantSlug,
      permissionCode: "ADMIN_USERS",
    });

    if (!gate.ok) {
      return NextResponse.json(
        { error: gate.error },
        { status: gate.status }
      );
    }

    const { db } = gate;

    const [rows]: any = await db.query(
      `
      SELECT
        u.id,
        u.firstName,
        u.lastName,
        u.badgeId,
        u.username,
        u.email,
        u.isActive,
        u.createdAt,
        r.name AS roleName
      FROM user u
      LEFT JOIN userrole ur
        ON ur.userId = u.id
      LEFT JOIN role r
        ON r.id = ur.roleId
      ORDER BY u.createdAt DESC, r.name ASC
      `
    );

    const byUser = new Map<
      string,
      {
        id: string;
        firstName: string | null;
        lastName: string | null;
        badgeId: string | null;
        fullName: string;
        username: string;
        email: string | null;
        isActive: boolean;
        createdAt: string;
        roles: string[];
      }
    >();

    for (const row of rows ?? []) {
      if (!byUser.has(row.id)) {
        const firstName = row.firstName ?? null;
        const lastName = row.lastName ?? null;
        const badgeId = row.badgeId ?? null;

        byUser.set(row.id, {
          id: String(row.id),
          firstName,
          lastName,
          badgeId,
          fullName: `${firstName ?? ""} ${lastName ?? ""}`.trim(),
          username: row.username,
          email: row.email ?? null,
          isActive: Boolean(row.isActive),
          createdAt: row.createdAt,
          roles: [],
        });
      }

      if (row.roleName) {
        byUser.get(row.id)!.roles.push(row.roleName);
      }
    }

    return NextResponse.json(
      { items: Array.from(byUser.values()) },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users
export async function POST(req: Request) {
  try {
    const tenantSlug =
      req.headers.get("x-tenant-slug")?.trim().toLowerCase() || undefined;

    const gate = await requireTenantAccess({
      tenantSlug,
      permissionCode: "ADMIN_USERS",
    });

    if (!gate.ok) {
      return NextResponse.json(
        { error: gate.error },
        { status: gate.status }
      );
    }

    const { db } = gate;

    const body = await req.json();

    const firstName = String(body?.firstName ?? "").trim();
    const lastName = String(body?.lastName ?? "").trim();
    const badgeId = String(body?.badgeId ?? "").trim();
    const username = String(body?.username ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const password = String(body?.password ?? "");
    const roleName = String(body?.roleName ?? "").trim();

    if (!firstName || !lastName || !badgeId || !username || !password || !roleName) {
      return NextResponse.json(
        {
          error:
            "firstName, lastName, badgeId, username, password, and roleName are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const [roleRows]: any = await db.query(
      `
      SELECT id, name
      FROM role
      WHERE name = ?
      LIMIT 1
      `,
      [roleName]
    );

    const role = roleRows?.[0];

    if (!role) {
      return NextResponse.json(
        { error: `Role '${roleName}' not found` },
        { status: 400 }
      );
    }

    const [existingUsers]: any = await db.query(
      `
      SELECT id
      FROM user
      WHERE username = ?
         OR badgeId = ?
         OR (? <> '' AND email = ?)
      LIMIT 1
      `,
      [username, badgeId, email, email]
    );

    if (existingUsers?.length) {
      return NextResponse.json(
        { error: "Username, badge ID, or email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      await conn.query(
        `
        INSERT INTO user (
          id,
          firstName,
          lastName,
          badgeId,
          username,
          email,
          passwordHash,
          isActive,
          sessionVersion,
          createdAt,
          updatedAt
        )
        VALUES (
          UUID(),
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          1,
          1,
          NOW(),
          NOW()
        )
        `,
        [firstName, lastName, badgeId, username, email || null, passwordHash]
      );

      const [createdRows]: any = await conn.query(
        `
        SELECT id, firstName, lastName, badgeId, username, email
        FROM user
        WHERE username = ?
        LIMIT 1
        `,
        [username]
      );

      const createdUser = createdRows?.[0];

      if (!createdUser) {
        throw new Error("Failed to load created user");
      }

      await conn.query(
        `
        INSERT INTO userrole (userId, roleId)
        VALUES (?, ?)
        `,
        [createdUser.id, role.id]
      );

      await conn.commit();

      return NextResponse.json(
        {
          ok: true,
          user: {
            ...createdUser,
            fullName: `${createdUser.firstName ?? ""} ${
              createdUser.lastName ?? ""
            }`.trim(),
            roles: [role.name],
          },
        },
        { status: 201 }
      );
    } catch (err: any) {
      await conn.rollback();

      if (err?.code === "ER_DUP_ENTRY") {
        return NextResponse.json(
          { error: "Username, badge ID, or email already exists" },
          { status: 409 }
        );
      }

      throw err;
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error("POST /api/admin/users error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}