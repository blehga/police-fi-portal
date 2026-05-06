import { PrismaClient } from "../src/generated/platform-client/index.js";
import { exec } from "child_process";
import { promisify } from "util";
import mysql from "mysql2/promise";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} missing`);
  }

  return value;
}

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
    const tenantUser = requiredEnv("MYSQL_TENANT_USER");
    const tenantPassword = requiredEnv("MYSQL_TENANT_PASSWORD");
    const tenantHost = requiredEnv("MYSQL_TENANT_HOST");
    const tenantPort = requiredEnv("MYSQL_TENANT_PORT");

    const tenantUrl = `mysql://${tenantUser}:${tenantPassword}@${tenantHost}:${tenantPort}/${job.databaseName}`;

    const tenantEnv = {
      ...process.env,
      DATABASE_URL: tenantUrl,
    };

    console.log("Pushing tenant schema:", job.databaseName);

    await execAsync("npx prisma db push --schema=prisma/schema.prisma", {
      env: tenantEnv,
    });

    console.log("Seeding tenant defaults:", job.databaseName);

    await execAsync("npm run prisma:seed", {
      env: tenantEnv,
    });

    console.log("Creating tenant admin user:", job.email);

    const tenantDb = await mysql.createConnection({
      host: tenantHost,
      port: Number(tenantPort),
      user: tenantUser,
      password: tenantPassword,
      database: job.databaseName,
    });

    const username = job.email.toLowerCase().trim();

    const [existingUsers]: any = await tenantDb.query(
      `SELECT id FROM user WHERE email = ? OR username = ? LIMIT 1`,
      [username, username]
    );

    let userId: number;

    if (existingUsers.length) {
      userId = existingUsers[0].id;

      await tenantDb.query(
        `
        UPDATE user
        SET
          username = ?,
          email = ?,
          passwordHash = ?,
          isActive = 1,
          updatedAt = NOW()
        WHERE id = ?
        `,
        [username, username, job.passwordHash, userId]
      );
    } else {
      const [userInsert]: any = await tenantDb.query(
        `
        INSERT INTO user (
          username,
          email,
          passwordHash,
          isActive,
          sessionVersion,
          createdAt,
          updatedAt
        )
        VALUES (?, ?, ?, 1, 1, NOW(), NOW())
        `,
        [username, username, job.passwordHash]
      );

      userId = userInsert.insertId;
    }

    const [roleRows]: any = await tenantDb.query(
      `SELECT id FROM role WHERE name = 'Admin' LIMIT 1`
    );

    let adminRoleId: number;

    if (roleRows.length) {
      adminRoleId = roleRows[0].id;
    } else {
      const [roleInsert]: any = await tenantDb.query(
        `
        INSERT INTO role (
          name,
          description,
          createdAt,
          updatedAt
        )
        VALUES ('Admin', 'System Administrator', NOW(), NOW())
        `
      );

      adminRoleId = roleInsert.insertId;
    }

    await tenantDb.query(
      `
      INSERT IGNORE INTO userrole (
        userId,
        roleId
      )
      VALUES (?, ?)
      `,
      [userId, adminRoleId]
    );

    await tenantDb.end();

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