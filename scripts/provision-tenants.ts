import { PrismaClient } from "../src/generated/platform-client/index.js";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function processOneJob() {
  console.log("🚀 Worker started");
  console.log("DB URL:", process.env.PLATFORM_DATABASE_URL);

  const job = await prisma.provisioningJob.findFirst({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
  });

  console.log("Job found:", job);

  if (!job) {
    console.log("No pending provisioning jobs.");
    return;
  }

  console.log("Processing job:", job.id.toString(), job.databaseName);

  await prisma.provisioningJob.update({
    where: { id: job.id },
    data: { status: "processing" },
  });

   try {
    const tenantUrl = `mysql://${process.env.MYSQL_TENANT_USER}:${process.env.MYSQL_TENANT_PASSWORD}@${process.env.MYSQL_TENANT_HOST}:${process.env.MYSQL_TENANT_PORT}/${job.databaseName}`;

    const tenantEnv = {
      ...process.env,
      DATABASE_URL: tenantUrl,
    };

    console.log("Pushing tenant schema:", job.databaseName);

    await execAsync("npx prisma db push --schema=prisma/schema.prisma", {
      env: tenantEnv,
    });

    console.log("Seeding tenant database:", job.databaseName);

    await execAsync("npm run prisma:seed", {
      env: tenantEnv,
    });

    await prisma.organization.update({
      where: { id: job.organizationId },
      data: { status: "active" },
    });

    await prisma.provisioningJob.update({
      where: { id: job.id },
      data: {
        status: "completed",
        error: null,
      },
    });

    console.log("Completed job:", job.id.toString());
  } catch (err) {
    console.error("Provisioning failed:", err);

    await prisma.provisioningJob.update({
      where: { id: job.id },
      data: {
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      },
    });
  }
}

async function main() {
  console.log("🚀 Worker service started");

  while (true) {
    try {
      await processOneJob();
    } catch (err) {
      console.error("Worker error:", err);
    }

    await new Promise((res) => setTimeout(res, 5000));
  }
}

main().catch(async (err) => {
  console.error("Fatal worker error:", err);
  await prisma.$disconnect();
  process.exit(1);
});