import { PrismaClient as PlatformClient } from "@/generated/platform-client";
import { PrismaClient as TenantClient } from "@prisma/client";

const platform = new PlatformClient();

export async function getTenantPrisma(slug: string) {
  const org = await platform.organization.findUnique({
    where: { slug },
    include: { database: true },
  });

  if (!org || !org.database) {
    throw new Error("Tenant not found");
  }

  if (org.status !== "active" && org.status !== "pending") {
    throw new Error("Organization inactive");
  }

  const db = org.database;

  const url = `mysql://${db.username}:${db.password}@${db.host}:${db.port}/${db.databaseName}`;

  return new TenantClient({
    datasources: {
      db: { url },
    },
  });
}