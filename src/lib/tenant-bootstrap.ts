import bcrypt from "bcryptjs";
import { PrismaClient } from "@/generated/prisma/client";

function getTenantDatabaseUrl(databaseName: string) {
 const baseUrl = process.env.DATABASE_URL || process.env.PLATFORM_DATABASE_URL;

  if (!baseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const url = new URL(baseUrl);
  url.pathname = `/${databaseName}`;

  return url.toString();
}

export async function seedTenantDatabase(
  databaseName: string,
  adminEmail: string,
  adminPassword: string
) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: getTenantDatabaseUrl(databaseName),
      },
    },
  });

  try {
    const permissionCodes = [
      "REPORT_READ",
      "REPORT_WRITE",
      "REPORT_DELETE",
      "ADMIN_USERS",
      "AUDIT_READ",
    ];

    for (const code of permissionCodes) {
      await prisma.permission.upsert({
        where: { code },
        update: {},
        create: { code },
      });
    }

    const adminRole = await prisma.role.upsert({
      where: { name: "admin" },
      update: {},
      create: { name: "admin" },
    });

    const officerRole = await prisma.role.upsert({
      where: { name: "officer" },
      update: {},
      create: { name: "officer" },
    });

    const viewerRole = await prisma.role.upsert({
      where: { name: "viewer" },
      update: {},
      create: { name: "viewer" },
    });

    const permissions = await prisma.permission.findMany();

    async function attachPermissions(roleId: string, codes: string[]) {
      for (const permission of permissions.filter((p) =>
        codes.includes(p.code)
      )) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId,
            permissionId: permission.id,
          },
        });
      }
    }

    await attachPermissions(adminRole.id, [
      "REPORT_READ",
      "REPORT_WRITE",
      "REPORT_DELETE",
      "ADMIN_USERS",
      "AUDIT_READ",
    ]);

    await attachPermissions(officerRole.id, ["REPORT_READ", "REPORT_WRITE"]);

    await attachPermissions(viewerRole.id, ["REPORT_READ"]);

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        username: "admin",
        passwordHash,
        isActive: true,
      },
      create: {
        username: "admin",
        email: adminEmail,
        passwordHash,
        isActive: true,
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    });

    console.log("✅ Tenant DB bootstrapped:", databaseName);
  } finally {
    await prisma.$disconnect();
  }
}