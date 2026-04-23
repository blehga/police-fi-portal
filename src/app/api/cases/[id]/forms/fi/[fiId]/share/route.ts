import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string; fiId: string }>;
};

export async function PATCH(_request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const { id, fiId } = await context.params;

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
        id: fiId,
        caseId: existingCase.id,
        formType: "FI",
      },
      select: {
        id: true,
        isShared: true,
        createdById: true,
      },
    });

    if (!existingForm) {
      return NextResponse.json({ error: "FI form not found" }, { status: 404 });
    }

    if (existingForm.createdById !== currentUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.caseForm.update({
      where: {
        id: existingForm.id,
      },
      data: {
        isShared: !existingForm.isShared,
      },
      select: {
        id: true,
        isShared: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        id: updated.id,
        isShared: updated.isShared,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "PATCH /api/cases/[id]/forms/fi/[fiId]/share failed:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update FI share status" },
      { status: 500 }
    );
  }
}