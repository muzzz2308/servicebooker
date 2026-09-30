import assert from "node:assert/strict";
import { test } from "node:test";

import { isUpdatableStatus, providerScheduleWindow } from "./schedule-window.ts";

test("providerScheduleWindow uses the provider timezone, not UTC", () => {
  // 03:00 UTC on 15 Sep is still Monday 14 Sep in New York (EDT).
  const now = new Date("2026-09-15T03:00:00.000Z");
  const window = providerScheduleWindow(now, "America/New_York");

  assert.equal(window.todayStart.toISOString(), "2026-09-14T04:00:00.000Z");
  assert.equal(window.todayEnd.toISOString(), "2026-09-15T04:00:00.000Z");
  // Week is Sunday 13 Sep – Saturday 19 Sep, New York.
  assert.equal(window.weekStart.toISOString(), "2026-09-13T04:00:00.000Z");
  assert.equal(window.weekEnd.toISOString(), "2026-09-20T04:00:00.000Z");
});

test("only cancelled, completed, and no_show are provider-updatable", () => {
  assert.equal(isUpdatableStatus("cancelled"), true);
  assert.equal(isUpdatableStatus("confirmed"), false);
  assert.equal(isUpdatableStatus("deleted"), false);
});
