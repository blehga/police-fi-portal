import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/platform-client";
import { createTenantDatabase } from "@/lib/platform/createTenantDatabase";
import { runTenantMigrations } from "@/lib/platform/runTenantMigrations";
import { seedTenantDatabase } from "@/lib/tenant-bootstrap";

const prisma = new PrismaClient();

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
const { company, email, password } = (await req.json()) as {
  company: string;
  email: string;
  password: string;
};

  try {
    const slug = generateSlug(company);

    const org = await prisma.organization.create({
      data: {
        name: company,
        slug,
        status: "pending",
      },
    });

    const db = await createTenantDatabase(slug);

    await runTenantMigrations(db.databaseName);

    await seedTenantDatabase(db.databaseName, email, password);

    await prisma.organizationDatabase.create({
      data: {
        organizationId: org.id,
        databaseName: db.databaseName,
        host: db.host,
        port: db.port,
        username: db.username,
        password: db.password,
        status: "active",
      },
    });

    return NextResponse.json({
      organizationId: Number(org.id),
    });
  } catch (err) {
    console.error("Register error:", err);

    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 }
    );
  }
}