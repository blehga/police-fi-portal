import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-prisma";
import { requirePermission } from "@/lib/require-permission";

function getTwoDigitYear(date: Date) {
  return Number(date.getFullYear().toString().slice(-2));
}

function formatCaseNumber(yearYY: number, seq: number) {
  return `${yearYY}-${String(seq).padStart(4, "0")}`;
}

function getPrismaFromSession(session: any) {
  const tenantDbName = session?.tenantDbName;

  if (!tenantDbName) {
    throw new Error("Missing tenantDbName in session");
  }

  return getTenantPrisma(tenantDbName);
}

export async function GET(request: Request) {
  try {
    const auth = await requirePermission("REPORT_READ");

    if (!auth.ok) {
      return auth.response;
    }

    const session = auth.session;
    const prisma = getPrismaFromSession(session);

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    const cases = await prisma.case.findMany({
      where: q
        ? {
            OR: [
              { caseNumber: { contains: q } },
              { incidentType: { contains: q } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        forms: { select: { formType: true } },
        persons: { select: { id: true } },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    const result = cases.map((item) => ({
      id: item.id,
      caseNumber: item.caseNumber,
      incidentType: item.incidentType,
      incidentDate: item.incidentDate
        ? item.incidentDate.toISOString().split("T")[0]
        : null,
      incidentTime: item.incidentTime,
      incidentLocation: item.incidentLocation,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      formCount: item.forms.length,
      formTypes: item.forms.map((f) => f.formType),
      personCount: item.persons.length,
      createdByName:
        [item.createdBy?.firstName, item.createdBy?.lastName]
          .filter(Boolean)
          .join(" ")
          .trim() ||
        item.createdBy?.username ||
        "Unknown",
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/cases failed:", error);
    return NextResponse.json(
      { error: "Failed to load cases" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requirePermission("REPORT_WRITE");

    if (!auth.ok) {
      return auth.response;
    }

    const session = auth.session;
    const prisma = getPrismaFromSession(session);
    const currentUserId = session.user.id;

    const body = await request.json().catch(() => ({}));

    const {
      incidentType,
      incidentDate,
      incidentTime,
      incidentLocation,
      isShared,
    } = body ?? {};

    const existingUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { id: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Invalid logged-in user" },
        { status: 400 }
      );
    }

    const now = new Date();
    const yearYY = getTwoDigitYear(now);

    const counter = await prisma.caseCounter.upsert({
      where: { year: yearYY },
      update: { last: { increment: 1 } },
      create: { year: yearYY, last: 1 },
    });

    const seq = counter.last;
    const caseNumber = formatCaseNumber(yearYY, seq);

    const createdCase = await prisma.case.create({
      data: {
        caseNumber,
        yearYY,
        seq,
        incidentType: incidentType ?? "",
        incidentDate: incidentDate ? new Date(incidentDate) : null,
        incidentTime: incidentTime ?? null,
        incidentLocation: incidentLocation ?? null,
        createdById: currentUserId,
        isShared: Boolean(isShared),
      },
    });

    return NextResponse.json(createdCase, { status: 201 });
  } catch (error) {
    console.error("POST /api/cases failed:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}