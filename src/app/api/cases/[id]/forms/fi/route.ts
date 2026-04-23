import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

function parseOptionalInt(value: unknown) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const createdFiles: string[] = [];

  try {
  const session: any = await getServerSession(authOptions as any);
const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
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
  photos = [],

  // ✅ ADD THESE
  incidentType,
  incidentDate,
  incidentTime,
  incidentLocation,
} = body ?? {};

// ✅ ADD HERE
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

    const photoDataUrls = Array.isArray(photos)
      ? photos.filter(
          (value: unknown): value is string =>
            typeof value === "string" && value.startsWith("data:image/")
        )
      : [];

    if (photoDataUrls.length > 3) {
      return NextResponse.json(
        { error: "A maximum of 3 FI photos is allowed." },
        { status: 400 }
      );
    }

    const created = await prisma.caseForm.create({
      data: {
        caseId: existingCase.id,
        formType: "FI",
        createdById: currentUserId,
        fiCard: {
          create: {
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
            createdById: currentUserId,
          },
        },
      },
      include: {
        fiCard: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!created.fiCard) {
      throw new Error("Failed to create FI card");
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

        const createdPerson = await prisma.person.create({
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
            gangName: person.gangName?.trim() || null,
            gangMembershipLength: person.gangMembershipLength?.trim() || null,
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
            onParole: Boolean(person.onParole),
            paroleOfficer: person.paroleOfficer?.trim() || null,
            parolePhone: person.parolePhone?.trim() || null,
            onProbation: Boolean(person.onProbation),
            probationOfficer: person.probationOfficer?.trim() || null,
            probationPhone: person.probationPhone?.trim() || null,
            vehicleLicense:person.vehicleLicense?.trim() || null,
            vehicleMake:person.vehicleMake?.trim() || null,
            vehicleModel:person.vehicleModel?.trim() || null,
            vehicleStyle:person.vehicleStyle?.trim() || null,
            vehicleYear:person.vehicleYear?.trim() || null,
            vehicleColor:person.vehicleColor?.trim() || null,
            vehicleState:person.vehicleState?.trim() || null,
            vehicleOddities:person.vehicleOddities?.trim() || null,
            comments:person.comments?.trim() || null,
          },
        });

        await prisma.formPerson.create({
          data: {
            caseFormId: created.id,
            personId: createdPerson.id,
            role: person.role?.trim() || "Subject",
            movementType: person.movementType?.trim() || null,
            isPrimary: Boolean(person.isPrimary),
          },
        });
      }
    }

    if (photoDataUrls.length > 0) {
      const savedPhotos: Array<{ filePath: string; publicUrl: string }> = [];

      try {
        for (const photo of photoDataUrls) {
          const saved = await saveDataUrlImage(photo, created.fiCard.id);
          createdFiles.push(saved.filePath);
          savedPhotos.push(saved);
        }

        await prisma.fIPhoto.createMany({
          data: savedPhotos.map((photo) => ({
            fiCardId: created.fiCard!.id,
            url: photo.publicUrl,
          })),
        });
      } catch (photoError) {
        for (const filePath of createdFiles) {
          try {
            await fs.unlink(filePath);
          } catch {}
        }
        throw photoError;
      }
    }

    return NextResponse.json(
      {
        caseFormId: created.id,
        formType: created.formType,
        fiCardId: created.fiCard.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/cases/[id]/forms/fi failed:", error);

    return NextResponse.json(
      { error: "Failed to create FI form" },
      { status: 500 }
    );
  }
}