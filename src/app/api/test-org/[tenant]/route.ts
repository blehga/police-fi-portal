import { NextResponse } from "next/server";
import { getTenantDbBySlug } from "@/lib/tenant-db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;
    const { organizationId, slug, db } = await getTenantDbBySlug(tenant);

    const [rows] = await db.query("SHOW TABLES");

    return NextResponse.json({
      success: true,
      organizationId,
      slug,
      tables: rows,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}