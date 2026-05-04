import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

export async function runTenantMigrations(databaseName: string) {
  const tenantUrl = `mysql://${process.env.MYSQL_TENANT_USER}:${process.env.MYSQL_TENANT_PASSWORD}@${process.env.MYSQL_TENANT_HOST}:${process.env.MYSQL_TENANT_PORT}/${databaseName}`;

  const prismaBin =
    process.platform === "win32"
      ? path.join(process.cwd(), "node_modules", ".bin", "prisma.cmd")
      : path.join(process.cwd(), "node_modules", ".bin", "prisma");

  await execFileAsync(
    prismaBin,
    ["db", "push", "--schema=prisma/schema.prisma"],
    {
      env: {
        ...process.env,
        DATABASE_URL: tenantUrl,
      },
    }
  );
}