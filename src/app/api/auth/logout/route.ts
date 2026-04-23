import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTenantDbBySlug } from "@/lib/tenant-db";
import { logAudit } from "../../../../../lib/audit/logAudit";

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.tenant || !session?.user?.id) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const { db, slug } = await getTenantDbBySlug(session.tenant);
    const conn = await db.getConnection();

    try {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        req.headers.get("x-real-ip") ??
        null;

      const userAgent = req.headers.get("user-agent");

      await logAudit(conn, {
        userId: null,
        actorUserId: session.user.id,
        action: "LOGOUT",
        entity: "auth",
        entityId: session.user.id,
        details: {
          tenant: slug,
          username: session.username ?? session.user?.name ?? null,
          ip,
          userAgent,
        },
      });
    } catch (err) {
      console.error("LOGOUT audit failed:", err);
    } finally {
      conn.release();
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("POST /api/auth/logout error:", err);
    return NextResponse.json(
      { error: err?.message || "Logout audit failed" },
      { status: 500 }
    );
  }
}