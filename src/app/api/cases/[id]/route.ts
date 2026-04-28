import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-prisma";
import { requirePermission } from "@/lib/require-permission";

function getPrismaFromSession(session: any) {
  const tenantDbName = session?.tenantDbName;

  if (!tenantDbName) {
    throw new Error("Missing tenantDbName in session");
  }

  return getTenantPrisma(tenantDbName);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const auth = await requirePermission("REPORT_READ");

    if (!auth.ok) {
      return auth.response;
    }

    const session = auth.session;
    const prisma = getPrismaFromSession(session);
    const currentUserId = session.user.id;

    const data = await prisma.case.findFirst({
      where: {
        OR: [{ id }, { caseNumber: id }],
      },
      include: {
        _count: {
          select: {
            forms: true,
          },
        },
        forms: {
          where: currentUserId
            ? {
                OR: [{ createdById: currentUserId }, { isShared: true }],
              }
            : {
                isShared: true,
              },
          orderBy: {
            createdAt: "asc",
          },
          include: {
            formPersons: {
              include: {
                person: true,
              },
            },
            createdBy: {
              select: {
                firstName: true,
                lastName: true,
                username: true,
              },
            },
            fiCard: {
              select: {
                id: true,
                subjectType: true,
                createdAt: true,
                updatedAt: true,
                photos: {
                  select: {
                    id: true,
                    url: true,
                  },
                  orderBy: {
                    createdAt: "asc",
                  },
                },
              },
            },
            narrative: {
              select: {
                id: true,
                narrativeText: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        persons: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            dob: true,
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const result = {
      id: data.id,
      caseNumber: data.caseNumber,
      incidentType: data.incidentType,
      incidentDate: data.incidentDate
        ? data.incidentDate.toISOString().split("T")[0]
        : null,
      incidentTime: data.incidentTime,
      incidentLocation: data.incidentLocation ?? null,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      formCount: data._count.forms,

      persons: data.persons.map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        fullName:
          p.fullName || `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim(),
        dob: p.dob ? p.dob.toISOString().split("T")[0] : null,
      })),

      forms: data.forms.map((f) => {
        const isCreator = currentUserId
          ? f.createdById === currentUserId
          : false;

        return {
          id: f.id,
          formType: f.formType,
          createdAt: f.createdAt.toISOString(),
          updatedAt: f.updatedAt?.toISOString(),
          createdByName:
            [f.createdBy?.firstName, f.createdBy?.lastName]
              .filter(Boolean)
              .join(" ")
              .trim() ||
            f.createdBy?.username ||
            "Unknown",
          isShared: f.isShared,
          canEdit: isCreator,
          canDelete: isCreator,

          fiCard: f.fiCard
            ? {
                id: f.fiCard.id,
                subjectType: f.fiCard.subjectType,
                createdAt: f.fiCard.createdAt.toISOString(),
                updatedAt: f.fiCard.updatedAt.toISOString(),
                photoCount: f.fiCard.photos.length,
                photos: f.fiCard.photos.map((photo) => ({
                  id: photo.id,
                  url: photo.url,
                })),
              }
            : null,

          narrative: f.narrative
            ? {
                id: f.narrative.id,
                narrativeText: f.narrative.narrativeText,
                createdAt: f.narrative.createdAt.toISOString(),
                updatedAt: f.narrative.updatedAt.toISOString(),
              }
            : null,

          people: f.formPersons.map((fp) => ({
            id: fp.person.id,
            firstName: fp.person.firstName,
            lastName: fp.person.lastName,
            fullName:
              fp.person.fullName ||
              `${fp.person.firstName ?? ""} ${fp.person.lastName ?? ""}`.trim(),
            dob: fp.person.dob
              ? fp.person.dob.toISOString().split("T")[0]
              : null,
            role: fp.role,
          })),
        };
      }),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/cases/[id] failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch case" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const auth = await requirePermission("REPORT_WRITE");

    if (!auth.ok) {
      return auth.response;
    }

    const session = auth.session;
    const prisma = getPrismaFromSession(session);

    const body = await request.json().catch(() => ({}));

    const { incidentType, incidentDate, incidentTime, incidentLocation } =
      body ?? {};

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

    const updatedCase = await prisma.case.update({
      where: { id: existingCase.id },
      data: {
        incidentType: incidentType ?? "",
        incidentDate: incidentDate ? new Date(incidentDate) : null,
        incidentTime: incidentTime ?? null,
        incidentLocation: incidentLocation ?? null,
      },
      select: {
        id: true,
        caseNumber: true,
        incidentType: true,
        incidentDate: true,
        incidentTime: true,
        incidentLocation: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ...updatedCase,
      incidentDate: updatedCase.incidentDate
        ? updatedCase.incidentDate.toISOString().split("T")[0]
        : null,
      updatedAt: updatedCase.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("PATCH /api/cases/[id] failed:", error);

    return NextResponse.json(
      { error: "Failed to update case" },
      { status: 500 }
    );
  }
}