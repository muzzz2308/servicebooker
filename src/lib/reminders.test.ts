import assert from "node:assert/strict";
import { test } from "node:test";

import { reminderWindow } from "./reminder-window.ts";

test("24h window is 23.5–24.5 hours from now", () => {
  const now = new Date("2026-09-17T12:00:00.000Z");
  const window = reminderWindow(now, 24);

  assert.equal(window.gte.toISOString(), "2026-09-18T11:30:00.000Z");
  assert.equal(window.lte.toISOString(), "2026-09-18T12:30:00.000Z");
});

test("1h window is 30–90 minutes from now", () => {
  const now = new Date("2026-09-17T12:00:00.000Z");
  const window = reminderWindow(now, 1);

  assert.equal(window.gte.toISOString(), "2026-09-17T12:30:00.000Z");
  assert.equal(window.lte.toISOString(), "2026-09-17T13:30:00.000Z");
});
