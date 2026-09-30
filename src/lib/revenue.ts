import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

import { resolveProviderDay } from "./slots.ts";

export type RevenuePoint = {
  day: string;
  label: string;
  cents: number;
};

export function shiftDay(dayStr: string, days: number) {
  const [year, month, day] = dayStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10);
}

export function revenueWindow(now: Date, timezone: string, days = 14) {
  const today = resolveProviderDay(now, timezone);
  const startDay = shiftDay(today.dayStr, -(days - 1));

  return {
    today: today.dayStr,
    startDay,
    rangeStart: fromZonedTime(`${startDay}T00:00:00`, timezone),
    rangeEnd: today.dayEnd,
  };
}

export function buildRevenueSeries(
  appointments: { startsAt: Date; amountPaidCents: number }[],
  timezone: string,
  days: string[],
): RevenuePoint[] {
  const totals = new Map(days.map((day) => [day, 0]));

  for (const appointment of appointments) {
    const day = formatInTimeZone(appointment.startsAt, timezone, "yyyy-MM-dd");
    if (!totals.has(day)) {
      continue;
    }

    totals.set(day, (totals.get(day) ?? 0) + appointment.amountPaidCents);
  }

  return days.map((day) => ({
    day,
    label: formatInTimeZone(
      fromZonedTime(`${day}T12:00:00`, timezone),
      timezone,
      "EEE d",
    ),
    cents: totals.get(day) ?? 0,
  }));
}

export const REVENUE_RANGES = [
  { id: "14d", label: "Last 14 days", days: 14 },
  { id: "month", label: "Last month", days: 30 },
  { id: "year", label: "Last year", days: 365 },
] as const;

export type RevenueRangeId = (typeof REVENUE_RANGES)[number]["id"];

export function sliceRevenueSeries(points: RevenuePoint[], days: number) {
  return points.slice(Math.max(0, points.length - days));
}

export function daysInRange(startDay: string, today: string) {
  const days = [startDay];
  let cursor = startDay;

  while (cursor < today) {
    cursor = shiftDay(cursor, 1);
    days.push(cursor);
  }

  return days;
}
