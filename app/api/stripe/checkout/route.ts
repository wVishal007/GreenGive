import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

const subscriptionMode = process.env.STRIPE_MODE || "mock";

const plans = {
  monthly: { amount: 6000, name: "Monthly", interval: "month" },
  yearly: { amount: 60000, name: "Yearly", interval: "year" },
};

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan = "monthly" } = await req.json();
  if (!plans[plan as keyof typeof plans]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  await connectToDatabase();
  const user = await User.findById(token.id);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Prevent duplicate active subscriptions
  if (user.subscriptionStatus === "active") {
    return NextResponse.json(
      { error: "Subscription already active" },
      { status: 400 },
    );
  }

  // MOCK MODE: Instant activation
  if (subscriptionMode === "mock") {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (plan === "yearly" ? 12 : 1));

    await User.findByIdAndUpdate(token.id, {
      subscriptionStatus: "active",
      subscriptionPlan: plan,
      subscriptionEnd: endDate,
    });

    return NextResponse.json({ mock: true, success: true });
  }

  // STRIPE MODE: Create checkout session
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 },
    );
  }

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId || undefined,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Digital Heroes - ${plans[plan as keyof typeof plans].name}`,
            },
            unit_amount: plans[plan as keyof typeof plans].amount,
            recurring: { interval: plans[plan as keyof typeof plans].interval },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: { userId: token.id, plan },
    });

    if (!user.stripeCustomerId && session.customer) {
      await User.findByIdAndUpdate(token.id, {
        stripeCustomerId: session.customer,
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
