import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireTenantAccess } from "@/lib/tenant-session";

export const dynamic = "force-dynamic";

export async function POST(
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

    const newPassword = String(body?.newPassword ?? "").trim();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const [userRows]: any = await db.query(
      `
      SELECT id, username
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

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.query(
      `
      UPDATE user
      SET passwordHash = ?,
          sessionVersion = sessionVersion + 1,
          updatedAt = NOW()
      WHERE id = ?
      `,
      [passwordHash, user.id]
    );

    return NextResponse.json({
      ok: true,
      message: `Password reset for ${user.username}`,
    });
  } catch (err: any) {
    console.error("POST /api/admin/users/[id]/reset-password error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}