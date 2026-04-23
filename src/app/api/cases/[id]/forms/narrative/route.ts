import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));

    const {
      content,
      beat,
      narrativeDate,
      narrativeDay,
      narrativeTime,
    } = body ?? {};

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