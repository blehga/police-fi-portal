/// <reference types="node" />

// scripts/repair-rbac.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1) Ensure permissions exist
  const permissionCodes = ["REPORT_READ", "REPORT_WRITE", "REPORT_DELETE", "ADMIN_USERS"];

  for (const code of permissionCodes) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { code },
    });
  }

  // 2) Ensure roles exist
  const [adminRole, officerRole, viewerRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: "admin" },
      update: {},
      create: { name: "admin" },
    }),
    prisma.role.upsert({
      where: { name: "officer" },
      update: {},
      create: { name: "officer" },
    }),
    prisma.role.upsert({
      where: { name: "viewer" },
      update: {},
      create: { name: "viewer" },
    }),
  ]);

  // 3) Load permissions
  const permissions = await prisma.permission.findMany();
 const byCode = Object.fromEntries(
  permissions.map((p: any) => [p.code, p])
);

  // 4) Desired role -> permission mapping
  const rolePermMap = [
    { roleId: adminRole.id, permissionId: byCode["REPORT_READ"].id },
    { roleId: adminRole.id, permissionId: byCode["REPORT_WRITE"].id },
    { roleId: adminRole.id, permissionId: byCode["REPORT_DELETE"].id },
    { roleId: adminRole.id, permissionId: byCode["ADMIN_USERS"].id },

    { roleId: officerRole.id, permissionId: byCode["REPORT_READ"].id },
    { roleId: officerRole.id, permissionId: byCode["REPORT_WRITE"].id },

    { roleId: viewerRole.id, permissionId: byCode["REPORT_READ"].id },
  ];

  await prisma.rolePermission.createMany({
    data: rolePermMap,
    skipDuplicates: true,
  });

  // 5) Ensure admin bootstrap user exists
  const passwordHash = await bcrypt.hash("ChangeThisAdminPassword!", 12);

  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      passwordHash,
      email: "admin@example.com",
      isActive: true,
    },
    create: {
      username: "admin",
      email: "admin@example.com",
      passwordHash,
      isActive: true,
    },
  });

  // 6) Ensure admin user is linked to admin role
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

  // 7) Print final summary
  const adminWithRoles = await prisma.user.findUnique({
    where: { id: adminUser.id },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const adminPerms = new Set<string>();
 adminWithRoles?.roles.forEach((ur: any) => {
   ur.role.permissions.forEach((rp: any) => {
      adminPerms.add(rp.permission.code);
    });
  });

  console.log("✅ RBAC repair complete.");
  console.log("Permissions ensured:", permissionCodes.join(", "));
  console.log("Roles ensured: admin, officer, viewer");
  console.log("Admin user ensured: admin / ChangeThisAdminPassword!");
  console.log("Admin effective permissions:", Array.from(adminPerms).join(", "));
}

main()
  .catch((e) => {
    console.error("❌ RBAC repair failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });