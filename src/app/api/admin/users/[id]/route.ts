import { NextResponse } from "next/server";
import { requireTenantAccess } from "@/lib/tenant-session";

// GET /api/admin/users/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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
        r.name AS roleName,
        p.code AS permissionCode
      FROM user u
      LEFT JOIN userrole ur ON ur.userId = u.id
      LEFT JOIN role r ON r.id = ur.roleId
      LEFT JOIN rolepermission rp ON rp.roleId = r.id
      LEFT JOIN permission p ON p.id = rp.permissionId
      WHERE u.id = ?
      `,
      [params.id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const first = rows[0];

    const roles = new Set<string>();
    const permissions = new Set<string>();

    for (const row of rows) {
      if (row.roleName) roles.add(row.roleName);
      if (row.permissionCode) permissions.add(row.permissionCode);
    }

    return NextResponse.json({
      id: first.id,
      firstName: first.firstName,
      lastName: first.lastName,
      badgeId: first.badgeId,
      username: first.username,
      email: first.email,
      isActive: Boolean(first.isActive),
      createdAt: first.createdAt,
      roles: Array.from(roles),
      permissions: Array.from(permissions),
    });
  } catch (err: any) {
    console.error("GET user error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load user" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id]
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    if (!firstName || !lastName || !badgeId || !username) {
      return NextResponse.json(
        {
          error:
            "firstName, lastName, badgeId, and username are required",
        },
        { status: 400 }
      );
    }

    // Check duplicates
    const [existing]: any = await db.query(
      `
      SELECT id
      FROM user
      WHERE (username = ? OR badgeId = ? OR (? <> '' AND email = ?))
        AND id <> ?
      LIMIT 1
      `,
      [username, badgeId, email, email, params.id]
    );

    if (existing?.length) {
      return NextResponse.json(
        { error: "Username, badge ID, or email already exists" },
        { status: 409 }
      );
    }

    await db.query(
      `
      UPDATE user
      SET
        firstName = ?,
        lastName = ?,
        badgeId = ?,
        username = ?,
        email = ?,
        updatedAt = NOW()
      WHERE id = ?
      `,
      [firstName, lastName, badgeId, username, email || null, params.id]
    );

    const [rows]: any = await db.query(
      `
      SELECT id, firstName, lastName, badgeId, username, email
      FROM user
      WHERE id = ?
      LIMIT 1
      `,
      [params.id]
    );

    const user = rows?.[0];

    return NextResponse.json({
      ok: true,
      user: {
        ...user,
        fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      },
    });
  } catch (err: any) {
    console.error("PATCH user error:", err);

    if (err?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Username, badge ID, or email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err?.message || "Failed to update user" },
      { status: 500 }
    );
  }
}