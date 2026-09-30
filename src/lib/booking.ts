import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

export const BOOKABLE_DAYS = 30;

export function chargeAmountCents(service: {
  priceCents: number;
  depositCents: number;
}) {
  return service.depositCents > 0 ? service.depositCents : service.priceCents;
}

/** The next `count` calendar days in the provider's timezone, as YYYY-MM-DD. */
export function listBookableDates(
  timezone: string,
  count = BOOKABLE_DAYS,
  now = new Date(),
) {
  const dates: string[] = [];
  let cursor = formatInTimeZone(now, timezone, "yyyy-MM-dd");

  for (let i = 0; i < count; i += 1) {
    dates.push(cursor);
    const [year, month, day] = cursor.split("-").map(Number);
    cursor = new Date(Date.UTC(year, month - 1, day + 1))
      .toISOString()
      .slice(0, 10);
  }

  return dates;
}

export function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** Noon on that calendar day in the provider's zone — never a DST midnight hole. */
export function instantOnProviderDate(dateStr: string, timezone: string) {
  return fromZonedTime(`${dateStr}T12:00:00`, timezone);
}
