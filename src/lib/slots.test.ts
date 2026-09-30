import assert from "node:assert/strict";
import { test } from "node:test";

import { computeAvailableSlots, type DayWindow } from "./slots.ts";

const TIMEZONE = "America/New_York";

// Monday 21 Sep 2026. September is EDT, so local time is UTC-4.
const MONDAY_9AM_LOCAL = new Date("2026-09-21T13:00:00Z");
const WEEK_BEFORE = new Date("2026-09-14T00:00:00Z");

// 09:00-17:00 on Mondays.
const MONDAY_9_TO_5: DayWindow[] = [
  { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
];

test("a fully open day slices into back-to-back slots", () => {
  const slots = computeAvailableSlots({
    date: MONDAY_9AM_LOCAL,
    timezone: TIMEZONE,
    durationMins: 60,
    availability: MONDAY_9_TO_5,
    now: WEEK_BEFORE,
  });

  // 09:00 through 16:00 local, the last slot ending exactly at close.
  assert.deepEqual(slots, [
    "2026-09-21T13:00:00.000Z",
    "2026-09-21T14:00:00.000Z",
    "2026-09-21T15:00:00.000Z",
    "2026-09-21T16:00:00.000Z",
    "2026-09-21T17:00:00.000Z",
    "2026-09-21T18:00:00.000Z",
    "2026-09-21T19:00:00.000Z",
    "2026-09-21T20:00:00.000Z",
  ]);
});

test("an appointment in the middle of the day removes only its own slot", () => {
  const slots = computeAvailableSlots({
    date: MONDAY_9AM_LOCAL,
    timezone: TIMEZONE,
    durationMins: 60,
    availability: MONDAY_9_TO_5,
    appointments: [
      {
        // 12:00-13:00 local.
        startsAt: new Date("2026-09-21T16:00:00Z"),
        endsAt: new Date("2026-09-21T17:00:00Z"),
      },
    ],
    now: WEEK_BEFORE,
  });

  assert.deepEqual(slots, [
    "2026-09-21T13:00:00.000Z",
    "2026-09-21T14:00:00.000Z",
    "2026-09-21T15:00:00.000Z",
    // 16:00Z is booked.
    "2026-09-21T17:00:00.000Z",
    "2026-09-21T18:00:00.000Z",
    "2026-09-21T19:00:00.000Z",
    "2026-09-21T20:00:00.000Z",
  ]);
});

test("a day covered by time off has no slots", () => {
  const slots = computeAvailableSlots({
    date: MONDAY_9AM_LOCAL,
    timezone: TIMEZONE,
    durationMins: 60,
    availability: MONDAY_9_TO_5,
    timeOff: [
      {
        // Midnight to midnight, local.
        startsAt: new Date("2026-09-21T04:00:00Z"),
        endsAt: new Date("2026-09-22T04:00:00Z"),
      },
    ],
    now: WEEK_BEFORE,
  });

  assert.deepEqual(slots, []);
});

test("slots that have already started are dropped", () => {
  const slots = computeAvailableSlots({
    date: MONDAY_9AM_LOCAL,
    timezone: TIMEZONE,
    durationMins: 60,
    availability: MONDAY_9_TO_5,
    // 13:30 local, i.e. part-way through the 13:00 slot.
    now: new Date("2026-09-21T17:30:00Z"),
  });

  assert.deepEqual(slots, [
    "2026-09-21T18:00:00.000Z",
    "2026-09-21T19:00:00.000Z",
    "2026-09-21T20:00:00.000Z",
  ]);
});

test("buffer time widens a booking on both sides", () => {
  const slots = computeAvailableSlots({
    date: MONDAY_9AM_LOCAL,
    timezone: TIMEZONE,
    durationMins: 60,
    availability: MONDAY_9_TO_5,
    appointments: [
      {
        startsAt: new Date("2026-09-21T16:00:00Z"),
        endsAt: new Date("2026-09-21T17:00:00Z"),
      },
    ],
    bufferMins: 30,
    now: WEEK_BEFORE,
  });

  // The booking now blocks 15:30Z-17:30Z, so 15:00Z no longer fits and the
  // afternoon restarts on the half hour.
  assert.deepEqual(slots, [
    "2026-09-21T13:00:00.000Z",
    "2026-09-21T14:00:00.000Z",
    "2026-09-21T17:30:00.000Z",
    "2026-09-21T18:30:00.000Z",
    "2026-09-21T19:30:00.000Z",
  ]);
});

test("the day is resolved in the provider's timezone, not UTC", () => {
  // 22:00 Monday local is already Tuesday in UTC. The provider's Monday
  // availability must still apply.
  const lateMondayLocal = new Date("2026-09-22T02:00:00Z");

  const slots = computeAvailableSlots({
    date: lateMondayLocal,
    timezone: TIMEZONE,
    durationMins: 60,
    availability: MONDAY_9_TO_5,
    now: WEEK_BEFORE,
  });

  assert.equal(slots.length, 8);
  assert.equal(slots[0], "2026-09-21T13:00:00.000Z");
});

test("a day with no availability record yields nothing", () => {
  const slots = computeAvailableSlots({
    date: MONDAY_9AM_LOCAL,
    timezone: TIMEZONE,
    durationMins: 60,
    // Sundays only.
    availability: [{ dayOfWeek: 0, startTime: "09:00", endTime: "17:00" }],
    now: WEEK_BEFORE,
  });

  assert.deepEqual(slots, []);
});
