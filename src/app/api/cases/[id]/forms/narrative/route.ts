import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-prisma";
import { requirePermission } from "@/lib/require-permission";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission("REPORT_WRITE");
    if (!auth.ok) return auth.response;

    const session: any = auth.session;
    const currentUserId = session?.user?.id;
    const tenantDbName = session?.tenantDbName;

    if (!currentUserId || !tenantDbName) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getTenantPrisma(tenantDbName);

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));

    const {
      content,
      beat,
      narrativeDate,
      narrativeDay,
      narrativeTime,
      incidentType,
      incidentDate,
      incidentTime,
      incidentLocation,
    } = body ?? {};

    if (!String(content ?? "").trim()) {
      return NextResponse.json(
        { error: "Narrative content is required." },
        { status: 400 }
      );
    }

    if (
      !String(incidentType ?? "").trim() ||
      !String(incidentDate ?? "").trim() ||
      !String(incidentTime ?? "").trim() ||
      !String(incidentLocation ?? "").trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Incident Type, Incident Date, Incident Time, and Incident Location are required.",
        },
        { status: 400 }
      );
    }

    const existingCase = await prisma.case.findFirst({
      where: {
        OR: [{ id }, { caseNumber: id }],
      },
      select: {
        id: true,
      },
    });

    if (!existingCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const authUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        badgeId: true,
      },
    });

    if (!authUser?.id) {
      return NextResponse.json(
        { error: "Unable to determine valid creator for Narrative form" },
        { status: 400 }
      );
    }

    const officerName =
      `${authUser.firstName ?? ""} ${authUser.lastName ?? ""}`.trim() || null;

    const officerId =
      typeof authUser.badgeId === "string" && authUser.badgeId.trim() !== ""
        ? authUser.badgeId.trim()
        : null;

    const created = await prisma.caseForm.create({
      data: {
        caseId: existingCase.id,
        formType: "NARRATIVE",
        createdById: currentUserId,
        narrative: {
          create: {
            narrativeText: content ?? "",
            officerName,
            officerId,
            beat: beat ?? null,
            narrativeDate: narrativeDate ? new Date(narrativeDate) : null,
            narrativeDay: narrativeDay ?? null,
            narrativeTime: narrativeTime ?? null,
            createdById: currentUserId,
          },
        },
      },
      select: {
        id: true,
        formType: true,
      },
    });

    return NextResponse.json(
      {
        caseFormId: created.id,
        formType: created.formType,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/cases/[id]/forms/narrative failed:", error);

    return NextResponse.json(
      { error: "Failed to create Narrative form" },
      { status: 500 }
    );
  }
}