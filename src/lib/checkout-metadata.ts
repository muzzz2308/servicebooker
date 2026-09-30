import { addWeeks } from "date-fns";

export type CheckoutMetadata = {
  providerId: string;
  serviceId: string;
  startsAt: Date;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  isRecurring: boolean;
};

/** The first slot plus `extraWeeks` copies, 7 days apart. */
export function weeklyStarts(first: Date, extraWeeks: number) {
  const starts = [first];

  for (let week = 1; week <= extraWeeks; week += 1) {
    starts.push(addWeeks(first, week));
  }

  return starts;
}

export function parseCheckoutMetadata(
  metadata: Record<string, string> | null | undefined,
): CheckoutMetadata | null {
  if (!metadata) {
    return null;
  }

  const {
    providerId,
    serviceId,
    startsAt: startsAtRaw,
    clientName,
    clientEmail,
    clientPhone,
    isRecurring,
  } = metadata;

  if (!providerId || !serviceId || !startsAtRaw || !clientName || !clientEmail || !clientPhone) {
    return null;
  }

  const startsAt = new Date(startsAtRaw);

  if (Number.isNaN(startsAt.getTime())) {
    return null;
  }

  return {
    providerId,
    serviceId,
    startsAt,
    clientName,
    clientEmail: clientEmail.trim().toLowerCase(),
    clientPhone,
    isRecurring: isRecurring === "true",
  };
}

export function paymentIntentIdFrom(
  paymentIntent: string | { id: string } | null | undefined,
) {
  if (!paymentIntent) {
    return null;
  }

  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}
