import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function runTenantMigrations(databaseName: string) {
  const tenantUrl = `mysql://${process.env.MYSQL_TENANT_USER}:${process.env.MYSQL_TENANT_PASSWORD}@${process.env.MYSQL_TENANT_HOST}:${process.env.MYSQL_TENANT_PORT}/${databaseName}`;

  await execFileAsync("npx", [
    "prisma",
    "db",
    "push",
    "--schema=prisma/schema.prisma",
  ], {
    env: {
      ...process.env,
      DATABASE_URL: tenantUrl,
    },
    shell: true,
  });
}