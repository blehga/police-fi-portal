import { PrismaClient } from "../../src/generated/platform-client";

const prisma = new PrismaClient();

async function main() {
  const plan = await prisma.subscription_plans.upsert({
    where: { code: "starter" },
    update: {
      name: "Starter",
      max_users: 25,
      features_json: { fi_form: true },
    },
    create: {
      name: "Starter",
      code: "starter",
      max_users: 25,
      features_json: { fi_form: true },
    },
  });

  const org = await prisma.organizations.upsert({
    where: { slug: "default" },
    update: {
      name: "Default Organization",
      type: "agency",
      status: "active",
    },
    create: {
      name: "Default Organization",
      slug: "default",
      type: "agency",
      status: "active",
    },
  });

  const existingSubscription = await prisma.organization_subscriptions.findFirst({
    where: {
      organization_id: org.id,
      subscription_plan_id: plan.id,
    },
  });

  if (!existingSubscription) {
    await prisma.organization_subscriptions.create({
      data: {
        organization_id: org.id,
        subscription_plan_id: plan.id,
        status: "active",
        start_date: new Date(),
      },
    });
  }

  const existingDb = await prisma.organization_databases.findFirst({
    where: { organization_id: org.id },
  });

  if (existingDb) {
    await prisma.organization_databases.update({
      where: { id: existingDb.id },
      data: {
        database_name: "tenant_default",
        host: "127.0.0.1",
        port: 3306,
        username: "fiuser",
        password: "mypassword",
        status: "active",
      },
    });
  } else {
    await prisma.organization_databases.create({
      data: {
        organization_id: org.id,
        database_name: "tenant_default",
        host: "127.0.0.1",
        port: 3306,
        username: "fiuser",
        password: "mypassword",
        status: "active",
      },
    });
  }

  console.log("✅ agency_platform seeded");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });