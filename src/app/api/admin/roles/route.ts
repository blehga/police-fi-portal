import { NextResponse } from "next/server";
import { requireTenantAccess } from "@/lib/tenant-session";

export const dynamic = "force-dynamic";

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
      SELECT id, name
      FROM role
      ORDER BY name ASC
      `
    );

    return NextResponse.json({ items: rows ?? [] }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/admin/roles error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch roles" },
      { status: 500 }
    );
  }
}