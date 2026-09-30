import assert from "node:assert/strict";
import { test } from "node:test";

import { formatTimezoneLabel, timesInProviderZone } from "./timezone.ts";

test("formatTimezoneLabel replaces underscores", () => {
  assert.equal(formatTimezoneLabel("America/New_York"), "America/New York");
});

test("timesInProviderZone names the provider zone, not the device", () => {
  const label = timesInProviderZone("America/New_York");

  assert.match(label, /America\/New York/);
  assert.match(label, /provider timezone/);
  assert.match(label, /not your device/);
});
