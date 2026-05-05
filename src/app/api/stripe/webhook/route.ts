import Stripe from "stripe";
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/platform-client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

function stripeDate(value: unknown, fallback: Date | null = null) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value * 1000)
    : fallback;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const organizationId = Number(session.metadata?.organizationId);
        const billingCycle = session.metadata?.billingCycle || "monthly";

        if (!organizationId || !session.subscription || !session.customer) {
          break;
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const plan = await prisma.subscriptionPlan.findFirst({
          where: { code: "starter" },
        });

        if (!plan) {
          throw new Error("Starter plan not found");
        }

        const startDate = stripeDate(
          (stripeSubscription as any).current_period_start,
          new Date()
        )!;

        const endDate = stripeDate(
          (stripeSubscription as any).current_period_end
        );

        await prisma.organizationSubscription.upsert({
          where: {
            stripeSubscriptionId: stripeSubscription.id,
          },
          update: {
            status: stripeSubscription.status,
            billingCycle,
            stripeCustomerId: String(session.customer),
            stripeCheckoutSessionId: session.id,
            startDate,
            endDate,
            cancelAtPeriodEnd: Boolean(
              stripeSubscription.cancel_at_period_end
            ),
          },
          create: {
            organizationId: BigInt(organizationId),
            subscriptionPlanId: plan.id,
            status: stripeSubscription.status,
            billingCycle,
            stripeCustomerId: String(session.customer),
            stripeSubscriptionId: stripeSubscription.id,
            stripeCheckoutSessionId: session.id,
            startDate,
            endDate,
            cancelAtPeriodEnd: Boolean(
              stripeSubscription.cancel_at_period_end
            ),
          },
        });

        await prisma.organization.update({
          where: { id: BigInt(organizationId) },
          data: { status: "active" },
        });

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        const subscriptionId =
          typeof (invoice as any).subscription === "string"
            ? (invoice as any).subscription
            : (invoice as any).subscription?.id;

        if (!subscriptionId) break;

        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );

        await prisma.organizationSubscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: stripeSubscription.status,
            startDate: stripeDate(
              (stripeSubscription as any).current_period_start,
              new Date()
            )!,
            endDate: stripeDate(
              (stripeSubscription as any).current_period_end
            ),
            cancelAtPeriodEnd: Boolean(
              stripeSubscription.cancel_at_period_end
            ),
          },
        });

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        const subscriptionId =
          typeof (invoice as any).subscription === "string"
            ? (invoice as any).subscription
            : (invoice as any).subscription?.id;

        if (!subscriptionId) break;

        await prisma.organizationSubscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "past_due" },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.organizationSubscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "canceled",
            endDate: stripeDate(subscription.ended_at, new Date()),
            cancelAtPeriodEnd: false,
          },
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}