import { NextResponse } from "next/server";

import { getAvailableSlots } from "@/lib/availability";
import { chargeAmountCents } from "@/lib/booking";
import { prisma } from "@/lib/prisma";
import { formatDuration } from "@/lib/schedule";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function originFrom(request: Request) {
  // Use the host the client actually hit so success/cancel land on this
  // server even when NEXTAUTH_URL still says :3000.
  return new URL(request.url).origin;
}

function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { slug, serviceId, startsAt, name, email, phone, isRecurring } = (body ??
    {}) as Record<string, unknown>;

  if (
    typeof slug !== "string" ||
    typeof serviceId !== "string" ||
    typeof startsAt !== "string" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string"
  ) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const clientName = name.trim();
  const clientEmail = email.trim().toLowerCase();
  const clientPhone = phone.trim();
  const slotStart = new Date(startsAt);

  if (clientName.length < 1 || clientName.length > 100) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(clientEmail)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (phoneDigits(clientPhone).length < 7) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  if (Number.isNaN(slotStart.getTime())) {
    return NextResponse.json({ error: "Invalid time slot." }, { status: 400 });
  }

  const provider = await prisma.provider.findUnique({
    where: { slug: slug.trim() },
    select: { id: true, slug: true, businessName: true, timezone: true },
  });

  if (!provider) {
    return NextResponse.json({ error: "Provider not found." }, { status: 404 });
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId, providerId: provider.id, isActive: true },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }

  const slotIso = slotStart.toISOString();
  const openSlots = await getAvailableSlots(provider.id, service.id, slotStart, {
    timezone: provider.timezone,
    durationMins: service.durationMins,
  });

  if (!openSlots.includes(slotIso)) {
    return NextResponse.json(
      { error: "That time is no longer available. Pick another slot." },
      { status: 409 },
    );
  }

  const amountCents = chargeAmountCents(service);

  if (amountCents < 50) {
    return NextResponse.json(
      { error: "This service cannot be booked online." },
      { status: 400 },
    );
  }

  const isDeposit = service.depositCents > 0;
  const origin = originFrom(request);
  const description = isDeposit
    ? `Deposit for ${formatDuration(service.durationMins)} ${service.name}`
    : `${formatDuration(service.durationMins)} appointment`;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // This account has Managed Payments on by default, which requires a
      // product tax code. We collect the provider's own appointment fee, so
      // Stripe should not be merchant of record for the session.
      managed_payments: { enabled: false },
      customer_email: clientEmail,
      success_url: `${origin}/book/${provider.slug}/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book/${provider.slug}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: `${service.name} — ${provider.businessName}`,
              description,
            },
          },
        },
      ],
      metadata: {
        providerId: provider.id,
        serviceId: service.id,
        startsAt: slotIso,
        clientName,
        clientEmail,
        clientPhone,
        isRecurring: isRecurring === true ? "true" : "false",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not start checkout." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof Error && error.message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json(
        { error: "Payments are not configured yet." },
        { status: 503 },
      );
    }

    console.error("Checkout session failed:", error);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 502 },
    );
  }
}
