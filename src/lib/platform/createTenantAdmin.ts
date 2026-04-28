import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

export async function createTenantAdmin(
  databaseName: string,
  email: string,
  password: string
) {
  const tenantUrl = `mysql://${process.env.MYSQL_TENANT_USER}:${process.env.MYSQL_TENANT_PASSWORD}@${process.env.MYSQL_TENANT_HOST}:${process.env.MYSQL_TENANT_PORT}/${databaseName}`;

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: tenantUrl,
      },
    },
  });

  const passwordHash = await bcrypt.hash(password, 10);

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
    },
  });

  const user = await prisma.user.create({
    data: {
      username: email,
      email,
      passwordHash,
      isActive: true,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: adminRole.id,
    },
  });

  await prisma.$disconnect();

  return user;
}