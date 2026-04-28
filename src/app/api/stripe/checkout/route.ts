import Stripe from "stripe";
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/platform-client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { organizationId, billingCycle } = await req.json();

  const plan = await prisma.subscriptionPlan.findFirst({
    where: { code: "starter" },
  });

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const priceId =
    billingCycle === "yearly"
      ? plan.stripeYearlyPriceId
      : plan.stripeMonthlyPriceId;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.APP_URL}/payment/success`,
    cancel_url: `${process.env.APP_URL}/payment/cancel`,
    metadata: {
      organizationId: String(organizationId),
      billingCycle,
    },
  });

  return NextResponse.json({ url: session.url });
}