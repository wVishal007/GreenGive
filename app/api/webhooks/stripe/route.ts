import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

const subscriptionMode = process.env.STRIPE_MODE || "mock";

export async function POST(req: NextRequest) {
  // MOCK MODE: Skip webhook processing
  if (subscriptionMode === "mock") {
    return NextResponse.json({ received: true, mock: true });
  }

  // STRIPE MODE: Verify signature
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 },
    );
  }

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = webhookSecret
      ? stripe.webhooks.constructEvent(body, signature, webhookSecret)
      : JSON.parse(body);
  } catch (err: any) {
    console.error(`Webhook error: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectToDatabase();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { userId, plan } = session.metadata || {};
        if (userId) {
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + (plan === "yearly" ? 12 : 1));
          await User.findByIdAndUpdate(userId, {
            subscriptionStatus: "active",
            subscriptionPlan: plan,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            subscriptionEnd: endDate,
          });
        }
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        if (subscriptionId) {
          const user = await User.findOne({
            stripeSubscriptionId: subscriptionId,
          });
          if (user) {
            user.subscriptionStatus = "active";
            await user.save();
          }
        }
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const user = await User.findOne({ stripeSubscriptionId: sub.id });
        if (user) {
          user.subscriptionStatus =
            sub.status === "active" ? "active" : "inactive";
          if (sub.current_period_end) {
            user.subscriptionEnd = new Date(sub.current_period_end * 1000);
          }
          await user.save();
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const user = await User.findOne({ stripeSubscriptionId: sub.id });
        if (user) {
          user.subscriptionStatus = "cancelled";
          await user.save();
        }
        break;
      }
    }
  } catch (error: any) {
    console.error(`Webhook processing error: ${error.message}`);
  }

  return NextResponse.json({ received: true });
}
