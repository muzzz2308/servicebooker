import { prisma } from "@/lib/prisma";
import { computeAvailableSlots, resolveProviderDay } from "@/lib/slots";

export type GetAvailableSlotsOptions = {
  bufferMins?: number;
  slotIntervalMins?: number;
  now?: Date;
  timezone?: string;
  durationMins?: number;
};

/** Cancelled appointments free their slot back up; everything else holds it. */
const BLOCKING_STATUSES = ["confirmed", "completed", "no_show"];

/**
 * Bookable start times (ISO strings) for one provider, one service, one day.
 * The day is resolved in the provider's stored timezone.
 */
export async function getAvailableSlots(
  providerId: string,
  serviceId: string,
  date: Date,
  options: GetAvailableSlotsOptions = {},
): Promise<string[]> {
  let timezone = options.timezone;
  let durationMins = options.durationMins;

  if (!timezone) {
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
      select: { timezone: true },
    });

    if (!provider) {
      throw new Error(`Provider ${providerId} not found.`);
    }

    timezone = provider.timezone;
  }

  if (durationMins == null) {
    const service = await prisma.service.findFirst({
      where: { id: serviceId, providerId },
      select: { durationMins: true },
    });

    if (!service) {
      throw new Error(`Service ${serviceId} not found for provider ${providerId}.`);
    }

    durationMins = service.durationMins;
  }

  const { dayOfWeek, dayStart, dayEnd } = resolveProviderDay(date, timezone);

  // Widen the query by the buffer so neighbouring-day bookings that bleed
  // across midnight still block the edges of this day.
  const bufferMs = (options.bufferMins ?? 0) * 60_000;
  const rangeStart = new Date(dayStart.getTime() - bufferMs);
  const rangeEnd = new Date(dayEnd.getTime() + bufferMs);

  const [availability, timeOff, appointments] = await Promise.all([
    prisma.availability.findMany({
      where: { providerId, dayOfWeek },
      select: { dayOfWeek: true, startTime: true, endTime: true },
    }),
    prisma.timeOff.findMany({
      where: {
        providerId,
        startsAt: { lt: rangeEnd },
        endsAt: { gt: rangeStart },
      },
      select: { startsAt: true, endsAt: true },
    }),
    prisma.appointment.findMany({
      where: {
        providerId,
        status: { in: BLOCKING_STATUSES },
        startsAt: { lt: rangeEnd },
        endsAt: { gt: rangeStart },
      },
      select: { startsAt: true, endsAt: true },
    }),
  ]);

  return computeAvailableSlots({
    date,
    timezone,
    durationMins,
    availability,
    timeOff,
    appointments,
    bufferMins: options.bufferMins,
    slotIntervalMins: options.slotIntervalMins,
    now: options.now,
  });
}
