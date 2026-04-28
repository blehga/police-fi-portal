import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

  // 🔥 CLEAR EXISTING DATA (DEV ONLY)
async function main() {
  await prisma.rolePermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();

  await prisma.permission.createMany({
    data: [
      { code: "REPORT_READ" },
      { code: "REPORT_WRITE" },
      { code: "REPORT_DELETE" },
      { code: "ADMIN_USERS" },
      { code: "AUDIT_READ" },
    ],
  });

  const [admin, officer, viewer] = await Promise.all([
    prisma.role.create({ data: { name: "admin" } }),
    prisma.role.create({ data: { name: "officer" } }),
    prisma.role.create({ data: { name: "viewer" } }),
  ]);

  const permissions = await prisma.permission.findMany();

  const adminPerms = permissions
    .filter((x) =>
      [
        "REPORT_READ",
        "REPORT_WRITE",
        "REPORT_DELETE",
        "ADMIN_USERS",
        "AUDIT_READ",
      ].includes(x.code)
    )
    .map((x) => ({ roleId: admin.id, permissionId: x.id }));

  const officerPerms = permissions
    .filter((x) => ["REPORT_READ", "REPORT_WRITE"].includes(x.code))
    .map((x) => ({ roleId: officer.id, permissionId: x.id }));

  const viewerPerms = permissions
    .filter((x) => ["REPORT_READ"].includes(x.code))
    .map((x) => ({ roleId: viewer.id, permissionId: x.id }));

  await prisma.rolePermission.createMany({ data: adminPerms });
  await prisma.rolePermission.createMany({ data: officerPerms });
  await prisma.rolePermission.createMany({ data: viewerPerms });

  const passwordHash = await bcrypt.hash("ChangeThisAdminPassword!", 12);

    const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      passwordHash,
      isActive: true,
    },
    create: {
      username: "admin",
      email: "admin@example.com",
      passwordHash,
      isActive: true,
    },
  });

  await prisma.userRole.deleteMany({
    where: {
      userId: adminUser.id,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: admin.id,
    },
  });

  console.log("✅ Tenant DB seeded");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });