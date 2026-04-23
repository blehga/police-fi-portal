// src/app/api/forms/fi/[fiId]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

function toDateOnlyString(value: Date | null | undefined) {
  return value ? value.toISOString().split("T")[0] : null;
}

function mapPersonForResponse(
  person: any,
  role: string,
  movementType: string | null,
  isPrimary: boolean
) {
  return {
    id: person.id,
    firstName: person.firstName ?? "",
    middleName: person.middleName ?? "",
    lastName: person.lastName ?? "",
    nickname: person.nickname ?? "",
    dob: toDateOnlyString(person.dob),
    age: person.age?.toString() ?? "",
    sex: person.sex ?? "",
    race: person.race ?? "",
    role: role ?? "Subject",
    movementType: movementType ?? "",
    isPrimary: Boolean(isPrimary),
  };
}

export async function GET(
  request: Request,
  context: { params: Promise<{ fiId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const { fiId } = await context.params;

    const form = await prisma.caseForm.findFirst({
      where: {
        id: fiId,
        formType: "FI",
      },
      include: {
        fiCard: {
          include: {
            photos: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
        formPersons: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            person: true,
          },
        },
      },
    });

    if (!form || !form.fiCard) {
      return NextResponse.json({ error: "FI form not found" }, { status: 404 });
    }

    const isCreator = form.createdById === currentUserId;
    const canRead = isCreator || form.isShared === true;
    const canEdit = isCreator;

    if (!canRead) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      caseFormId: form.id,
      fiCardId: form.fiCard.id,
      isShared: form.isShared,
      canEdit,
      canDelete: isCreator,
      subjectType: form.fiCard.subjectType ?? "",
      agency: form.fiCard.agency ?? "",
      reasonForStop: form.fiCard.reasonForStop ?? "",
      locationOfStop: form.fiCard.locationOfStop ?? "",
      disposition: form.fiCard.disposition ?? "",
      additionalComments: form.fiCard.additionalComments ?? "",
      officerName: form.fiCard.officerName ?? "",
      officerId: form.fiCard.officerId ?? "",
      beat: form.fiCard.beat ?? "",
      fiDate: toDateOnlyString(form.fiCard.fiDate) ?? "",
      fiDay: form.fiCard.fiDay ?? "",
      fiTime: form.fiCard.fiTime ?? "",
      people: form.formPersons.map((fp) =>
        mapPersonForResponse(fp.person, fp.role, fp.movementType, fp.isPrimary)
      ),
      photos: form.fiCard.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
      })),
    });
  } catch (error) {
    console.error("GET /api/forms/fi/[fiId] failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch FI form" },
      { status: 500 }
    );
  }
}