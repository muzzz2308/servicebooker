import assert from "node:assert/strict";
import { test } from "node:test";

import {
  firstName,
  formatHourMinutes,
  greetingForHour,
  trialDaysLeft,
} from "./dashboard-home.ts";

test("greeting splits the day into morning, afternoon, and evening", () => {
  assert.equal(greetingForHour(8), "Good morning");
  assert.equal(greetingForHour(12), "Good afternoon");
  assert.equal(greetingForHour(16), "Good afternoon");
  assert.equal(greetingForHour(17), "Good evening");
});

test("firstName uses the leading token", () => {
  assert.equal(firstName("Iris Patel"), "Iris");
  assert.equal(firstName("  Maya  "), "Maya");
});

test("formatHourMinutes prints compact hours and minutes", () => {
  assert.equal(formatHourMinutes(0), "0h 0m");
  assert.equal(formatHourMinutes(90), "1h 30m");
});

test("trialDaysLeft is 14 on signup day and 0 after two weeks", () => {
  const created = new Date("2026-09-19T10:00:00Z");
  assert.equal(trialDaysLeft(created, new Date("2026-09-19T18:00:00Z")), 14);
  assert.equal(trialDaysLeft(created, new Date("2026-10-04T10:00:00Z")), 0);
});
