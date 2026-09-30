import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

/** A weekly Availability window, with wall-clock "HH:MM" times. */
export type DayWindow = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

/** Anything that blocks the calendar: time off, or a booked appointment. */
export type BusyPeriod = {
  startsAt: Date;
  endsAt: Date;
};

export type ComputeAvailableSlotsInput = {
  /** Any instant falling on the target day, interpreted in `timezone`. */
  date: Date;
  /** IANA zone, e.g. "America/New_York". */
  timezone: string;
  durationMins: number;
  availability: DayWindow[];
  timeOff?: BusyPeriod[];
  appointments?: BusyPeriod[];
  /** Dead time padded around every busy period, on both sides. */
  bufferMins?: number;
  /** Gap between consecutive slot starts. Defaults to `durationMins`. */
  slotIntervalMins?: number;
  /** Injectable clock; slots starting before this are dropped. */
  now?: Date;
};

type Interval = { start: number; end: number };

const MS_PER_MIN = 60_000;

/**
 * Resolves which calendar day `date` falls on *in the provider's timezone*,
 * which can differ from both UTC and the server's local day.
 */
export function resolveProviderDay(date: Date, timezone: string) {
  const dayStr = formatInTimeZone(date, timezone, "yyyy-MM-dd");
  const [year, month, day] = dayStr.split("-").map(Number);

  // Date.UTC rolls month/year over for us, and avoids DST entirely.
  const nextDayStr = new Date(Date.UTC(year, month - 1, day + 1))
    .toISOString()
    .slice(0, 10);

  return {
    dayStr,
    // Noon UTC on that calendar date is never a DST edge, and getUTCDay
    // does not depend on the server's timezone.
    dayOfWeek: new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay(),
    dayStart: fromZonedTime(`${dayStr}T00:00:00`, timezone),
    dayEnd: fromZonedTime(`${nextDayStr}T00:00:00`, timezone),
  };
}

function mergeIntervals(intervals: Interval[]): Interval[] {
  const sorted = intervals
    .filter((interval) => interval.end > interval.start)
    .sort((a, b) => a.start - b.start);

  const merged: Interval[] = [];

  for (const interval of sorted) {
    const last = merged.at(-1);

    if (last && interval.start <= last.end) {
      last.end = Math.max(last.end, interval.end);
    } else {
      merged.push({ ...interval });
    }
  }

  return merged;
}

/** Carves every `cut` out of `base`, returning the leftover pieces. */
function subtractIntervals(base: Interval, cuts: Interval[]): Interval[] {
  let pieces: Interval[] = [base];

  for (const cut of cuts) {
    const remaining: Interval[] = [];

    for (const piece of pieces) {
      const disjoint = cut.end <= piece.start || cut.start >= piece.end;

      if (disjoint) {
        remaining.push(piece);
        continue;
      }

      if (cut.start > piece.start) {
        remaining.push({ start: piece.start, end: cut.start });
      }

      if (cut.end < piece.end) {
        remaining.push({ start: cut.end, end: piece.end });
      }
    }

    pieces = remaining;
  }

  return pieces;
}

/**
 * Pure slot engine: given a day's availability plus everything blocking it,
 * returns bookable start times as ISO strings, soonest first.
 */
export function computeAvailableSlots(
  input: ComputeAvailableSlotsInput,
): string[] {
  const {
    date,
    timezone,
    durationMins,
    availability,
    timeOff = [],
    appointments = [],
    bufferMins = 0,
    now = new Date(),
  } = input;

  const slotIntervalMins = input.slotIntervalMins ?? durationMins;

  if (durationMins <= 0 || slotIntervalMins <= 0) {
    return [];
  }

  const { dayStr, dayOfWeek } = resolveProviderDay(date, timezone);

  // Availability times are wall clock in the provider's zone, so they must be
  // anchored to this specific date to become real instants.
  const windows = mergeIntervals(
    availability
      .filter((window) => window.dayOfWeek === dayOfWeek)
      .map((window) => ({
        start: fromZonedTime(
          `${dayStr}T${window.startTime}:00`,
          timezone,
        ).getTime(),
        end: fromZonedTime(`${dayStr}T${window.endTime}:00`, timezone).getTime(),
      })),
  );

  if (windows.length === 0) {
    return [];
  }

  const bufferMs = bufferMins * MS_PER_MIN;
  const busy = mergeIntervals(
    [...timeOff, ...appointments].map((period) => ({
      start: period.startsAt.getTime() - bufferMs,
      end: period.endsAt.getTime() + bufferMs,
    })),
  );

  const durationMs = durationMins * MS_PER_MIN;
  const stepMs = slotIntervalMins * MS_PER_MIN;
  const earliestStart = now.getTime();
  const starts: number[] = [];

  for (const window of windows) {
    for (const free of subtractIntervals(window, busy)) {
      for (let start = free.start; start + durationMs <= free.end; start += stepMs) {
        if (start >= earliestStart) {
          starts.push(start);
        }
      }
    }
  }

  return starts.sort((a, b) => a - b).map((start) => new Date(start).toISOString());
}
