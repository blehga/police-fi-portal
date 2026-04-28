import { PrismaClient } from "../../src/generated/platform-client";

const prisma = new PrismaClient();

async function main() {
  await prisma.subscriptionPlan.upsert({
    where: { code: "starter" },
    update: {
      name: "Starter",
      maxUsers: 25,
      monthlyPrice: "49.00",
      yearlyPrice: "499.00",
      stripeMonthlyPriceId: "price_1TQwa1D3qjCO2ZKxbFp8PSEz",
      stripeYearlyPriceId: "price_1TQwcRD3qjCO2ZKxZpTyjmdN",
      features: {
        fi_form: true,
        cases: true,
        photos: true,
        audit_logs: true,
      },
    },
    create: {
      name: "Starter",
      code: "starter",
      maxUsers: 25,
      monthlyPrice: "49.00",
      yearlyPrice: "499.00",
      stripeMonthlyPriceId: "price_1TQwa1D3qjCO2ZKxbFp8PSEz",
      stripeYearlyPriceId: "price_1TQwcRD3qjCO2ZKxZpTyjmdN",
      features: {
        fi_form: true,
        cases: true,
        photos: true,
        audit_logs: true,
      },
    },
  });

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