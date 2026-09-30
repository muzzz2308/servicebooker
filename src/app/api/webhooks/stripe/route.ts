import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { fulfillPaidCheckout } from "@/lib/fulfill-checkout";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const stripe = getStripe();
      const completed = event.data.object;
      // Snapshot payloads sometimes omit expanded fields; fetch the session
      // so payment_intent and amount_total are definitely present.
      const session = await stripe.checkout.sessions.retrieve(completed.id);
      await fulfillPaidCheckout(session);
    } catch (error) {
      console.error("Failed to fulfill checkout session:", error);
      return NextResponse.json({ error: "Fulfillment failed." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
