import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
    fiId: string;
  }>;
};

function parseOptionalInt(value: unknown) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toDateOnlyString(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function mapPersonForResponse(
  person: any,
  role: string | null,
  movementType: string | null,
  isPrimary: boolean
) {
  return {
    id: person.id,
    role: role ?? "Subject",
    movementType: movementType ?? "",
    isPrimary: Boolean(isPrimary),

    firstName: person.firstName ?? "",
    middleName: person.middleName ?? "",
    lastName: person.lastName ?? "",
    nickname: person.nickname ?? "",
    dob: toDateOnlyString(person.dob) ?? "",
    age: person.age?.toString() ?? "",
    sex: person.sex ?? "",
    race: person.race ?? "",

    address: person.address ?? "",
    city: person.city ?? "",
    state: person.state ?? "",
    zip: person.zip ?? "",
    phone: person.phone ?? "",
    email: person.email ?? "",

    primaryLanguage: person.primaryLanguage ?? "",
    description: person.description ?? "",

    height: person.height ?? "",
    weight: person.weight ?? "",
    build: person.build ?? "",
    hairColor: person.hairColor ?? "",
    hairLength: person.hairLength ?? "",
    hairStyle: person.hairStyle ?? "",
    eyeColor: person.eyeColor ?? "",
    complexion: person.complexion ?? "",
    teeth: person.teeth ?? "",
    handPreference: person.handPreference ?? "",

    tattoos: person.tattoos ?? "",
    scars: person.scars ?? "",
    needleMarks: person.needleMarks ?? "",
    tracks: person.tracks ?? "",
    glasses: person.glasses ?? "",
    mustache: person.mustache ?? "",
    beard: person.beard ?? "",

    socialSecurity: person.socialSecurity ?? "",
    driverLicense: person.driverLicense ?? "",
    driverLicenseState: person.driverLicenseState ?? "",
    otherId: person.otherId ?? "",
    otherIdType: person.otherIdType ?? "",
    otherIdState: person.otherIdState ?? "",

    school: person.school ?? "",
    schoolAddress: person.schoolAddress ?? "",
    schoolCity: person.schoolCity ?? "",
    schoolState: person.schoolState ?? "",
    schoolZip: person.schoolZip ?? "",
    schoolPhone: person.schoolPhone ?? "",

    parentName: person.parentName ?? "",
    parentAddress: person.parentAddress ?? "",
    parentCity: person.parentCity ?? "",
    parentState: person.parentState ?? "",
    parentZip: person.parentZip ?? "",
    parentPhone: person.parentPhone ?? "",

    occupation: person.occupation ?? "",
    employerName: person.employerName ?? "",
    employerAddress: person.employerAddress ?? "",
    employerCity: person.employerCity ?? "",
    employerState: person.employerState ?? "",
    employerZip: person.employerZip ?? "",
    employerPhone: person.employerPhone ?? "",

    gangName: person.gangName ?? "",
    gangMembershipLength: person.gangMembershipLength ?? "",

    onParole: Boolean(person.onParole),
    paroleOfficer: person.paroleOfficer ?? "",
    parolePhone: person.parolePhone ?? "",
    onProbation: Boolean(person.onProbation),
    probationOfficer: person.probationOfficer ?? "",
    probationPhone: person.probationPhone ?? "",

    vehicleLicense: person.vehicleLicense ?? "",
    vehicleMake: person.vehicleMake ?? "",
    vehicleModel: person.vehicleModel ?? "",
    vehicleStyle: person.vehicleStyle ?? "",
    vehicleYear: person.vehicleYear ?? "",
    vehicleColor: person.vehicleColor ?? "",
    vehicleState: person.vehicleState ?? "",
    vehicleOddities: person.vehicleOddities ?? "",

    comments: person.comments ?? "",
  };
}

async function saveDataUrlImage(dataUrl: string, fiCardId: string) {
  const match = dataUrl.match(
    /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/
  );

  if (!match) {
    throw new Error(
      "Invalid image format. Only PNG, JPG, JPEG, and WEBP are supported."
    );
  }

  const mimeType = match[1];
  const base64 = match[2];

  const extension =
    mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
      ? "webp"
      : "jpg";

  const buffer = Buffer.from(base64, "base64");
  const directory = path.join(process.cwd(), "public", "uploads", "fi", fiCardId);

  await fs.mkdir(directory, { recursive: true });

  const fileName = `${randomUUID()}.${extension}`;
  const filePath = path.join(directory, fileName);
  const publicUrl = `/uploads/fi/${fiCardId}/${fileName}`;

  await fs.writeFile(filePath, buffer);

  return {
    filePath,
    publicUrl,
  };
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const form = await prisma.caseForm.findFirst({
      where: {
        id: fiId,
        caseId: existingCase.id,
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
    console.error("GET /api/cases/[id]/forms/fi/[fiId] failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch FI form" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const createdFiles: string[] = [];
  const deletedPhotoUrlsAfterCommit: string[] = [];

  try {
    const session: any = await getServerSession(authOptions as any);
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, fiId } = await context.params;
    const body = await request.json().catch(() => ({}));

    const {
      subjectType,
      agency,
      reasonForStop,
      locationOfStop,
      disposition,
      additionalComments,
      beat,
      fiDate,
      fiDay,
      fiTime,
      people = [],
      deletedPhotoIds = [],
      newPhotos = [],
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

    const existingForm = await prisma.caseForm.findFirst({
      where: {
        id: fiId,
        caseId: existingCase.id,
        formType: "FI",
      },
      include: {
        fiCard: {
          include: {
            photos: true,
          },
        },
        formPersons: {
          include: {
            person: true,
          },
        },
      },
    });

    if (!existingForm || !existingForm.fiCard) {
      return NextResponse.json({ error: "FI form not found" }, { status: 404 });
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

    const officerName = `${authUser?.firstName ?? ""} ${authUser?.lastName ?? ""}`.trim();
    const officerId =
      typeof authUser?.badgeId === "string" && authUser.badgeId.trim() !== ""
        ? authUser.badgeId.trim()
        : null;

    const fiCardId = existingForm.fiCard.id;

    const photoIdsToDelete = Array.isArray(deletedPhotoIds)
      ? deletedPhotoIds.filter(
          (value: unknown): value is string =>
            typeof value === "string" && value.trim().length > 0
        )
      : [];

    const newPhotoDataUrls = Array.isArray(newPhotos)
      ? newPhotos.filter(
          (value: unknown): value is string =>
            typeof value === "string" && value.startsWith("data:image/")
        )
      : [];

    const currentPhotoCount = existingForm.fiCard.photos.length;
    const remainingPhotoCount =
      currentPhotoCount - photoIdsToDelete.length + newPhotoDataUrls.length;

    if (remainingPhotoCount > 3) {
      return NextResponse.json(
        { error: "A maximum of 3 FI photos is allowed." },
        { status: 400 }
      );
    }

    const savedNewPhotos: { filePath: string; publicUrl: string }[] = [];
    for (const photo of newPhotoDataUrls) {
      const saved = await saveDataUrlImage(photo, fiCardId);
      createdFiles.push(saved.filePath);
      savedNewPhotos.push(saved);
    }

    await prisma.$transaction(async (tx) => {
      await tx.fICard.update({
        where: {
          caseFormId: existingForm.id,
        },
        data: {
          subjectType: subjectType ?? null,
          agency: agency ?? null,
          reasonForStop: reasonForStop ?? null,
          locationOfStop: locationOfStop ?? null,
          disposition: disposition ?? null,
          additionalComments: additionalComments ?? null,
          officerName: officerName || null,
          officerId,
          beat: beat ?? null,
          fiDate: fiDate ? new Date(fiDate) : null,
          fiDay: fiDay ?? null,
          fiTime: fiTime ?? null,
        },
      });

      if (photoIdsToDelete.length > 0) {
        const photosToDelete = await tx.fIPhoto.findMany({
          where: {
            id: {
              in: photoIdsToDelete,
            },
            fiCardId,
          },
          select: {
            id: true,
            url: true,
          },
        });

        if (photosToDelete.length > 0) {
          deletedPhotoUrlsAfterCommit.push(
            ...photosToDelete.map((photo) => photo.url)
          );

          await tx.fIPhoto.deleteMany({
            where: {
              id: {
                in: photosToDelete.map((photo) => photo.id),
              },
            },
          });
        }
      }

      if (savedNewPhotos.length > 0) {
        await tx.fIPhoto.createMany({
          data: savedNewPhotos.map((photo) => ({
            fiCardId,
            url: photo.publicUrl,
          })),
        });
      }

      const existingPersonIds = existingForm.formPersons
        .map((fp) => fp.personId)
        .filter((value): value is string => typeof value === "string" && value.length > 0);

      await tx.formPerson.deleteMany({
        where: {
          caseFormId: existingForm.id,
        },
      });

      if (existingPersonIds.length > 0) {
        await tx.person.deleteMany({
          where: {
            id: {
              in: existingPersonIds,
            },
          },
        });
      }

      if (Array.isArray(people) && people.length > 0) {
        for (const person of people) {
          const firstName = person.firstName?.trim() || null;
          const middleName = person.middleName?.trim() || null;
          const lastName = person.lastName?.trim() || null;
          const nickname = person.nickname?.trim() || null;

          const fullName =
            [firstName, middleName, lastName].filter(Boolean).join(" ").trim() ||
            null;

          const createdPerson = await tx.person.create({
            data: {
              caseId: existingCase.id,
              firstName,
              middleName,
              lastName,
              fullName,
              nickname,
              dob: person.dob ? new Date(person.dob) : null,
              age: parseOptionalInt(person.age),
              sex: person.sex?.trim() || null,
              address: person.address?.trim() || null,
              city: person.city?.trim() || null,
              state: person.state?.trim() || null,
              zip: person.zip?.trim() || null,
              phone: person.phone?.trim() || null,
              email: person.email?.trim() || null,
              race: person.race?.trim() || null,
              primaryLanguage: person.primaryLanguage?.trim() || null,
              description: person.description?.trim() || null,
              height: person.height?.trim() || null,
              weight: person.weight?.trim() || null,
              build: person.build?.trim() || null,
              eyeColor: person.eyeColor?.trim() || null,
              hairColor: person.hairColor?.trim() || null,
              hairLength: person.hairLength?.trim() || null,
              hairStyle: person.hairStyle?.trim() || null,
              complexion: person.complexion?.trim() || null,
              teeth: person.teeth?.trim() || null,
              handPreference: person.handPreference?.trim() || null,
              tattoos: person.tattoos?.trim() || null,
              scars: person.scars?.trim() || null,
              needleMarks: person.needleMarks?.trim() || null,
              tracks: person.tracks?.trim() || null,
              glasses: person.glasses?.trim() || null,
              mustache: person.mustache?.trim() || null,
              beard: person.beard?.trim() || null,
              socialSecurity: person.socialSecurity?.trim() || null,
              driverLicense: person.driverLicense?.trim() || null,
              driverLicenseState: person.driverLicenseState?.trim() || null,
              otherId: person.otherId?.trim() || null,
              otherIdType: person.otherIdType?.trim() || null,
              otherIdState: person.otherIdState?.trim() || null,
              school: person.school?.trim() || null,
              schoolAddress: person.schoolAddress?.trim() || null,
              schoolCity: person.schoolCity?.trim() || null,
              schoolState: person.schoolState?.trim() || null,
              schoolZip: person.schoolZip?.trim() || null,
              schoolPhone: person.schoolPhone?.trim() || null,
              parentName: person.parentName?.trim() || null,
              parentAddress: person.parentAddress?.trim() || null,
              parentCity: person.parentCity?.trim() || null,
              parentState: person.parentState?.trim() || null,
              parentZip: person.parentZip?.trim() || null,
              parentPhone: person.parentPhone?.trim() || null,
              occupation: person.occupation?.trim() || null,
              employerName: person.employerName?.trim() || null,
              employerAddress: person.employerAddress?.trim() || null,
              employerCity: person.employerCity?.trim() || null,
              employerState: person.employerState?.trim() || null,
              employerZip: person.employerZip?.trim() || null,
              employerPhone: person.employerPhone?.trim() || null,
              gangName: person.gangName?.trim() || null,
              gangMembershipLength: person.gangMembershipLength?.trim() || null,
              onParole: Boolean(person.onParole),
              paroleOfficer: person.paroleOfficer?.trim() || null,
              parolePhone: person.parolePhone?.trim() || null,
              onProbation: Boolean(person.onProbation),
              probationOfficer: person.probationOfficer?.trim() || null,
              probationPhone: person.probationPhone?.trim() || null,
              vehicleLicense: person.vehicleLicense?.trim() || null,
              vehicleMake: person.vehicleMake?.trim() || null,
              vehicleModel: person.vehicleModel?.trim() || null,
              vehicleStyle: person.vehicleStyle?.trim() || null,
              vehicleYear: person.vehicleYear?.trim() || null,
              vehicleColor: person.vehicleColor?.trim() || null,
              vehicleState: person.vehicleState?.trim() || null,
              vehicleOddities: person.vehicleOddities?.trim() || null,
              comments: person.comments?.trim() || null,
            },
          });

          await tx.formPerson.create({
            data: {
              caseFormId: existingForm.id,
              personId: createdPerson.id,
              role: person.role?.trim() || "Subject",
              movementType: person.movementType?.trim() || null,
              isPrimary: Boolean(person.isPrimary),
            },
          });
        }
      }
    });

    for (const photoUrl of deletedPhotoUrlsAfterCommit) {
      const relativePath = photoUrl.replace(/^\/+/, "");
      const absolutePath = path.join(process.cwd(), "public", relativePath);

      try {
        await fs.unlink(absolutePath);
      } catch {}
    }

    const updated = await prisma.caseForm.findFirst({
      where: {
        id: fiId,
        caseId: existingCase.id,
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

    if (!updated || !updated.fiCard) {
      throw new Error("Failed to reload updated FI form");
    }

    return NextResponse.json({
      caseFormId: updated.id,
      fiCardId: updated.fiCard.id,
      isShared: updated.isShared,
      canEdit: true,
      canDelete: true,

      subjectType: updated.fiCard.subjectType ?? "",
      agency: updated.fiCard.agency ?? "",
      reasonForStop: updated.fiCard.reasonForStop ?? "",
      locationOfStop: updated.fiCard.locationOfStop ?? "",
      disposition: updated.fiCard.disposition ?? "",
      additionalComments: updated.fiCard.additionalComments ?? "",
      officerName: updated.fiCard.officerName ?? "",
      officerId: updated.fiCard.officerId ?? "",
      beat: updated.fiCard.beat ?? "",
      fiDate: toDateOnlyString(updated.fiCard.fiDate) ?? "",
      fiDay: updated.fiCard.fiDay ?? "",
      fiTime: updated.fiCard.fiTime ?? "",
      people: updated.formPersons.map((fp) =>
        mapPersonForResponse(fp.person, fp.role, fp.movementType, fp.isPrimary)
      ),
      photos: updated.fiCard.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
      })),
    });
  } catch (error) {
    for (const filePath of createdFiles) {
      try {
        await fs.unlink(filePath);
      } catch {}
    }

    console.error("PATCH /api/cases/[id]/forms/fi/[fiId] failed:", error);

    return NextResponse.json(
      { error: "Failed to update FI form" },
      { status: 500 }
    );
  }
}
