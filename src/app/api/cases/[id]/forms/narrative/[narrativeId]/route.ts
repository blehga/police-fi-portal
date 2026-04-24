import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
    narrativeId: string;
  }>;
};

function toDateOnlyString(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, narrativeId } = await context.params;

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

    const form = await prisma.caseForm.findFirst({
      where: {
        id: narrativeId,
        caseId: existingCase.id,
        formType: "NARRATIVE",
      },
      include: {
        narrative: true,
      },
    });

    if (!form || !form.narrative) {
      return NextResponse.json(
        { error: "Narrative form not found" },
        { status: 404 }
      );
    }

    const isCreator = form.createdById === currentUserId;
    const canRead = isCreator || form.isShared === true;
    const canEdit = isCreator;

    if (!canRead) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      caseFormId: form.id,
      narrativeId: form.narrative.id,
      isShared: form.isShared,
      canEdit,
      canDelete: isCreator,

      content: form.narrative.narrativeText ?? "",
      officerName: form.narrative.officerName ?? "",
      officerId: form.narrative.officerId ?? "",
      beat: form.narrative.beat ?? "",
      narrativeDate: toDateOnlyString(form.narrative.narrativeDate),
      narrativeDay: form.narrative.narrativeDay ?? "",
      narrativeTime: form.narrative.narrativeTime ?? "",
    });
  } catch (error) {
    console.error(
      "GET /api/cases/[id]/forms/narrative/[narrativeId] failed:",
      error
    );

    return NextResponse.json(
      { error: "Failed to fetch Narrative form" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, narrativeId } = await context.params;
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

    const existingForm = await prisma.caseForm.findFirst({
      where: {
        id: narrativeId,
        caseId: existingCase.id,
        formType: "NARRATIVE",
      },
      include: {
        narrative: true,
      },
    });

    if (!existingForm || !existingForm.narrative) {
      return NextResponse.json(
        { error: "Narrative form not found" },
        { status: 404 }
      );
    }

    if (existingForm.createdById !== currentUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const authUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        firstName: true,
        lastName: true,
        badgeId: true,
      },
    });

    const officerName =
      `${authUser?.firstName ?? ""} ${authUser?.lastName ?? ""}`.trim() || null;

    const officerId =
      typeof authUser?.badgeId === "string" && authUser.badgeId.trim() !== ""
        ? authUser.badgeId.trim()
        : null;

    const updated = await prisma.narrative.update({
      where: {
        caseFormId: existingForm.id,
      },
      data: {
        narrativeText: content ?? "",
        officerName,
        officerId,
        beat: beat ?? null,
        narrativeDate: narrativeDate ? new Date(narrativeDate) : null,
        narrativeDay: narrativeDay ?? null,
        narrativeTime: narrativeTime ?? null,
      },
    });

    return NextResponse.json({
      caseFormId: existingForm.id,
      narrativeId: updated.id,
      isShared: existingForm.isShared,
      canEdit: true,
      canDelete: true,

      content: updated.narrativeText ?? "",
      officerName: updated.officerName ?? "",
      officerId: updated.officerId ?? "",
      beat: updated.beat ?? "",
      narrativeDate: toDateOnlyString(updated.narrativeDate),
      narrativeDay: updated.narrativeDay ?? "",
      narrativeTime: updated.narrativeTime ?? "",
    });
  } catch (error) {
    console.error(
      "PATCH /api/cases/[id]/forms/narrative/[narrativeId] failed:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update Narrative form" },
      { status: 500 }
    );
  }
}