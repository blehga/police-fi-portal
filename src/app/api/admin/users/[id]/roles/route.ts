import { NextResponse } from "next/server";
import { requireTenantAccess } from "@/lib/tenant-session";

export const dynamic = "force-dynamic";

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

    const roleNames = Array.isArray(body?.roles)
      ? body.roles.map((x: unknown) => String(x).trim()).filter(Boolean)
      : [];

    if (roleNames.length === 0) {
      return NextResponse.json(
        { error: "At least one role is required" },
        { status: 400 }
      );
    }

    const [userRows]: any = await db.query(
      `
      SELECT id
      FROM user
      WHERE id = ?
      LIMIT 1
      `,
      [params.id]
    );

    const user = userRows?.[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const placeholders = roleNames.map(() => "?").join(", ");

    const [roleRows]: any = await db.query(
      `
      SELECT id, name
      FROM role
      WHERE name IN (${placeholders})
      `,
      roleNames
    );

    const roles = roleRows ?? [];

    const foundRoleNames = new Set(roles.map((r: any) => r.name));
  const missingRoles = roleNames.filter(
  (name: string) => !foundRoleNames.has(name)
);

    if (missingRoles.length > 0) {
      return NextResponse.json(
        { error: `One or more roles were not found: ${missingRoles.join(", ")}` },
        { status: 400 }
      );
    }

    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      await conn.query(
        `
        DELETE FROM userrole
        WHERE userId = ?
        `,
        [params.id]
      );

      for (const role of roles) {
        await conn.query(
          `
          INSERT INTO userrole (userId, roleId)
          VALUES (?, ?)
          `,
          [params.id, role.id]
        );
      }

      await conn.query(
        `
        UPDATE user
        SET sessionVersion = sessionVersion + 1,
            updatedAt = NOW()
        WHERE id = ?
        `,
        [params.id]
      );

      await conn.commit();

      return NextResponse.json({
        ok: true,
        roles: roles.map((r: any) => r.name),
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error("PATCH /api/admin/users/[id]/roles error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update roles" },
      { status: 500 }
    );
  }
}