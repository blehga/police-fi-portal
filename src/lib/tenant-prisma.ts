import { PrismaClient } from "../generated/prisma/client";

const tenantClients = new Map<string, PrismaClient>();

function getTenantDatabaseUrl(databaseName: string) {
  const host = process.env.MYSQL_TENANT_HOST ?? "127.0.0.1";
  const port = process.env.MYSQL_TENANT_PORT ?? "3306";
  const user = process.env.MYSQL_TENANT_USER ?? "fiuser";
  const password = process.env.MYSQL_TENANT_PASSWORD ?? "mypassword";

  return `mysql://${user}:${password}@${host}:${port}/${databaseName}`;
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