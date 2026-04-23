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

    const { db, userId } = gate;

    if (userId === params.id) {
      return NextResponse.json(
        { error: "You cannot disable your own account" },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (typeof body?.isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be true or false" },
        { status: 400 }
      );
    }

    const [userRows]: any = await db.query(
      `
      SELECT id, isActive
      FROM user
      WHERE id = ?
      LIMIT 1
      `,
      [params.id]
    );

    const existing = userRows?.[0];

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.query(
      `
      UPDATE user
      SET isActive = ?,
          sessionVersion = sessionVersion + 1,
          updatedAt = NOW()
      WHERE id = ?
      `,
      [body.isActive ? 1 : 0, params.id]
    );

    return NextResponse.json({
      ok: true,
      user: {
        id: params.id,
        isActive: body.isActive,
      },
    });
  } catch (err: any) {
    console.error("PATCH /api/admin/users/[id]/status error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update status" },
      { status: 500 }
    );
  }
}