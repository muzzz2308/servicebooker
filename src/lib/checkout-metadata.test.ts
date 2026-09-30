import assert from "node:assert/strict";
import { test } from "node:test";

import {
  parseCheckoutMetadata,
  paymentIntentIdFrom,
  weeklyStarts,
} from "./checkout-metadata.ts";
import { toE164 } from "./notifications.ts";

const FIRST = new Date("2026-09-15T17:00:00.000Z");

test("weeklyStarts returns the original slot plus N following weeks", () => {
  const starts = weeklyStarts(FIRST, 7);

  assert.equal(starts.length, 8);
  assert.equal(starts[0].toISOString(), "2026-09-15T17:00:00.000Z");
  assert.equal(starts[1].toISOString(), "2026-09-22T17:00:00.000Z");
  assert.equal(starts[7].toISOString(), "2026-11-03T17:00:00.000Z");
});

test("parseCheckoutMetadata reads booking fields from Stripe metadata", () => {
  const parsed = parseCheckoutMetadata({
    providerId: "prov_1",
    serviceId: "svc_1",
    startsAt: FIRST.toISOString(),
    clientName: "Pat Client",
    clientEmail: "Pat@Example.com",
    clientPhone: "555-555-0123",
    isRecurring: "true",
  });

  assert.ok(parsed);
  assert.equal(parsed.clientEmail, "pat@example.com");
  assert.equal(parsed.isRecurring, true);
  assert.equal(parsed.startsAt.toISOString(), FIRST.toISOString());
});

test("parseCheckoutMetadata rejects incomplete metadata", () => {
  assert.equal(parseCheckoutMetadata({ providerId: "prov_1" }), null);
  assert.equal(parseCheckoutMetadata(null), null);
});

test("paymentIntentIdFrom accepts a string or expanded object", () => {
  assert.equal(paymentIntentIdFrom("pi_123"), "pi_123");
  assert.equal(paymentIntentIdFrom({ id: "pi_123" }), "pi_123");
  assert.equal(paymentIntentIdFrom(null), null);
});

test("toE164 normalizes US numbers", () => {
  assert.equal(toE164("555-555-0123"), "+15555550123");
  assert.equal(toE164("+44 7700 900123"), "+447700900123");
  assert.equal(toE164("12"), null);
});
