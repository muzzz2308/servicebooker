import Stripe from "stripe";

import { parseCheckoutMetadata, paymentIntentIdFrom, weeklyStarts } from "@/lib/checkout-metadata";
import { sendBookingConfirmations } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

const EXTRA_WEEKLY_APPOINTMENTS = 7;

export async function fulfillPaidCheckout(session: Stripe.Checkout.Session) {
  const metadata = parseCheckoutMetadata(session.metadata);

  if (!metadata) {
    throw new Error("Checkout session is missing booking metadata.");
  }

  const stripePaymentIntentId =
    paymentIntentIdFrom(session.payment_intent) ?? `checkout:${session.id}`;

  const already = await prisma.appointment.findFirst({
    where: { stripePaymentIntentId },
    select: { id: true },
  });

  if (already) {
    return { created: false as const };
  }

  const [provider, service] = await Promise.all([
    prisma.provider.findUnique({
      where: { id: metadata.providerId },
      select: {
        id: true,
        slug: true,
        businessName: true,
        timezone: true,
      },
    }),
    prisma.service.findFirst({
      where: { id: metadata.serviceId, providerId: metadata.providerId },
    }),
  ]);

  if (!provider || !service) {
    throw new Error("Provider or service from checkout metadata no longer exists.");
  }

  const starts = metadata.isRecurring
    ? weeklyStarts(metadata.startsAt, EXTRA_WEEKLY_APPOINTMENTS)
    : [metadata.startsAt];
  const durationMs = service.durationMins * 60_000;
  const amountPaidCents = session.amount_total ?? 0;

  await prisma.$transaction(
    async (tx) => {
      const existingClient = await tx.client.findFirst({
        where: {
          providerId: provider.id,
          email: metadata.clientEmail,
        },
      });

      let clientId: string;

      if (existingClient) {
        await tx.client.updateMany({
          where: { id: existingClient.id, providerId: provider.id },
          data: {
            name: metadata.clientName,
            phone: metadata.clientPhone,
          },
        });
        clientId = existingClient.id;
      } else {
        const created = await tx.client.create({
          data: {
            providerId: provider.id,
            name: metadata.clientName,
            email: metadata.clientEmail,
            phone: metadata.clientPhone,
          },
        });
        clientId = created.id;
      }

      await tx.appointment.createMany({
        data: starts.map((startsAt, index) => ({
          providerId: provider.id,
          clientId,
          serviceId: service.id,
          startsAt,
          endsAt: new Date(startsAt.getTime() + durationMs),
          status: "confirmed",
          isRecurring: metadata.isRecurring,
          recurrenceRule: metadata.isRecurring ? "WEEKLY" : null,
          stripePaymentIntentId,
          amountPaidCents: index === 0 ? amountPaidCents : 0,
        })),
      });
    },
    { maxWait: 15_000, timeout: 20_000 },
  );

  await sendBookingConfirmations({
    toEmail: metadata.clientEmail,
    toPhone: metadata.clientPhone,
    clientName: metadata.clientName,
    businessName: provider.businessName,
    serviceName: service.name,
    timezone: provider.timezone,
    startsAt: metadata.startsAt,
    slug: provider.slug,
    isRecurring: metadata.isRecurring,
    extraWeeklyCount: metadata.isRecurring ? EXTRA_WEEKLY_APPOINTMENTS : 0,
  });

  return { created: true as const };
}
