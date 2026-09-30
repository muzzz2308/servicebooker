import { fromZonedTime } from "date-fns-tz";

import { resolveProviderDay } from "./slots.ts";

export const APPOINTMENT_STATUSES = [
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const UPDATABLE_STATUSES = ["cancelled", "completed", "no_show"] as const;

export type UpdatableStatus = (typeof UPDATABLE_STATUSES)[number];

export function isUpdatableStatus(value: string): value is UpdatableStatus {
  return (UPDATABLE_STATUSES as readonly string[]).includes(value);
}

/**
 * Today and the Sunday–Saturday week containing `now`, in the provider's zone.
 */
export function providerScheduleWindow(now: Date, timezone: string) {
  const today = resolveProviderDay(now, timezone);
  const [year, month, day] = today.dayStr.split("-").map(Number);
  const weekStartStr = new Date(Date.UTC(year, month - 1, day - today.dayOfWeek))
    .toISOString()
    .slice(0, 10);
  const nextWeekStr = new Date(
    Date.UTC(year, month - 1, day - today.dayOfWeek + 7),
  )
    .toISOString()
    .slice(0, 10);

  return {
    todayStart: today.dayStart,
    todayEnd: today.dayEnd,
    weekStart: fromZonedTime(`${weekStartStr}T00:00:00`, timezone),
    weekEnd: fromZonedTime(`${nextWeekStr}T00:00:00`, timezone),
  };
}
