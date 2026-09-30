import assert from "node:assert/strict";
import { test } from "node:test";

import { chargeAmountCents, isIsoDate, listBookableDates } from "./booking.ts";

test("deposit of 0 charges the full price", () => {
  assert.equal(chargeAmountCents({ priceCents: 6500, depositCents: 0 }), 6500);
});

test("a positive deposit is charged instead of the full price", () => {
  assert.equal(chargeAmountCents({ priceCents: 6500, depositCents: 2000 }), 2000);
});

test("listBookableDates starts today in the provider timezone and spans 30 days", () => {
  const dates = listBookableDates(
    "America/Los_Angeles",
    30,
    new Date("2026-09-21T16:00:00Z"), // 09:00 local PDT
  );

  assert.equal(dates.length, 30);
  assert.equal(dates[0], "2026-09-21");
  assert.equal(dates[29], "2026-10-20");
  assert.ok(dates.every(isIsoDate));
});
