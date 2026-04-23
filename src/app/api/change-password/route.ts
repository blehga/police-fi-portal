import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireTenantAccess } from "@/lib/tenant-session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const tenantSlug =
      req.headers.get("x-tenant-slug")?.trim().toLowerCase() || undefined;

    const gate = await requireTenantAccess({ tenantSlug });

    if (!gate.ok) {
      return NextResponse.json(
        { error: gate.error },
        { status: gate.status }
      );
    }

    const { db, userId } = gate;
    const body = await req.json();

    const oldPassword = String(body?.oldPassword ?? "");
    const newPassword = String(body?.newPassword ?? "");

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const [userRows]: any = await db.query(
      `
      SELECT id, passwordHash
      FROM user
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    );

    const user = userRows?.[0];

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const matches = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!matches) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
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

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("POST /api/change-password error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to change password" },
      { status: 500 }
    );
  }
}