import { PrismaClient } from "../generated/prisma/client";

const tenantClients = new Map<string, PrismaClient>();

function getTenantDatabaseUrl(databaseName: string) {
  const {
    MYSQL_TENANT_HOST,
    MYSQL_TENANT_PORT,
    MYSQL_TENANT_USER,
    MYSQL_TENANT_PASSWORD,
  } = process.env;

  if (!MYSQL_TENANT_HOST) {
    throw new Error("MYSQL_TENANT_HOST missing");
  }

  if (!MYSQL_TENANT_PORT) {
    throw new Error("MYSQL_TENANT_PORT missing");
  }

  if (!MYSQL_TENANT_USER) {
    throw new Error("MYSQL_TENANT_USER missing");
  }

  if (!MYSQL_TENANT_PASSWORD) {
    throw new Error("MYSQL_TENANT_PASSWORD missing");
  }

  return `mysql://${MYSQL_TENANT_USER}:${MYSQL_TENANT_PASSWORD}@${MYSQL_TENANT_HOST}:${MYSQL_TENANT_PORT}/${databaseName}`;
}
export function getTenantPrisma(databaseName: string) {
  if (!tenantClients.has(databaseName)) {
    tenantClients.set(
      databaseName,
      new PrismaClient({
        datasources: {
          db: {
            url: getTenantDatabaseUrl(databaseName),
          },
        },
      })
    );
  }

  return tenantClients.get(databaseName)!;
}