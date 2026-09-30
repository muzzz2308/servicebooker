import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildRevenueSeries,
  daysInRange,
  shiftDay,
  sliceRevenueSeries,
} from "./revenue.ts";

test("shiftDay rolls across month boundaries", () => {
  assert.equal(shiftDay("2026-09-01", -1), "2026-08-31");
  assert.equal(shiftDay("2026-09-19", 2), "2026-09-21");
});

test("daysInRange is inclusive", () => {
  assert.deepEqual(daysInRange("2026-09-18", "2026-09-20"), [
    "2026-09-18",
    "2026-09-19",
    "2026-09-20",
  ]);
});

test("buildRevenueSeries buckets paid amounts on the provider day", () => {
  const series = buildRevenueSeries(
    [
      { startsAt: new Date("2026-09-19T13:00:00Z"), amountPaidCents: 6500 },
      { startsAt: new Date("2026-09-19T18:00:00Z"), amountPaidCents: 2500 },
      { startsAt: new Date("2026-09-21T15:00:00Z"), amountPaidCents: 4000 },
    ],
    "America/New_York",
    ["2026-09-19", "2026-09-20", "2026-09-21"],
  );

  assert.equal(series[0].cents, 9000);
  assert.equal(series[1].cents, 0);
  assert.equal(series[2].cents, 4000);
  assert.equal(series[0].label.includes("19"), true);
});

test("sliceRevenueSeries keeps the most recent days", () => {
  const points = daysInRange("2026-09-01", "2026-09-10").map((day) => ({
    day,
    label: day,
    cents: 100,
  }));

  const month = sliceRevenueSeries(points, 3);
  assert.equal(month.length, 3);
  assert.equal(month[0].day, "2026-09-08");
  assert.equal(month[2].day, "2026-09-10");
});
