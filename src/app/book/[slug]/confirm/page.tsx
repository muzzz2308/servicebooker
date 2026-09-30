import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonClass, cardClass, mutedClass } from "@/components/ui";
import { paymentIntentIdFrom } from "@/lib/checkout-metadata";
import { formatAppointmentWhen } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { timesInProviderZone } from "@/lib/timezone";

type Params = { slug: string };

export const dynamic = "force-dynamic";
export const metadata = { title: "Booking confirmed" };

export default async function BookingConfirmPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: { session_id?: string };
}) {
  const provider = await prisma.provider.findUnique({
    where: { slug: params.slug },
    select: { id: true, slug: true, businessName: true, timezone: true },
  });

  if (!provider) {
    notFound();
  }

  const appointment = await findPaidAppointment(
    provider.id,
    searchParams.session_id,
  );

  return (
    <main className="mx-auto max-w-md p-6 py-12">
      <div className={cardClass}>
        <h1 className="text-2xl font-semibold tracking-tight">
          {appointment ? "You're booked" : "Booking status"}
        </h1>
        <p className={`mt-2 ${mutedClass}`}>
          {appointment
            ? `${appointment.service.name} with ${provider.businessName} is confirmed for ${formatAppointmentWhen(appointment.startsAt, provider.timezone)}.`
            : searchParams.session_id
              ? `We're confirming your payment with ${provider.businessName}. Refresh this page in a moment if your appointment details don't appear.`
              : `We couldn't find this booking. If you just paid, wait a moment and refresh.`}
        </p>
        <p className={`mt-3 ${mutedClass}`}>
          {timesInProviderZone(provider.timezone)}
        </p>
        <Link
          href={`/book/${provider.slug}`}
          className={`${buttonClass} mt-6 block text-center`}
        >
          Book another time
        </Link>
      </div>
    </main>
  );
}

async function findPaidAppointment(providerId: string, sessionId?: string) {
  if (!sessionId) {
    return null;
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const paymentIntentId =
      paymentIntentIdFrom(session.payment_intent) ?? `checkout:${session.id}`;

    return prisma.appointment.findFirst({
      where: { providerId, stripePaymentIntentId: paymentIntentId },
      select: { startsAt: true, service: { select: { name: true } } },
      orderBy: { startsAt: "asc" },
    });
  } catch {
    return null;
  }
}
