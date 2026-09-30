import assert from "node:assert/strict";
import { test } from "node:test";

import {
  confirmationEmail,
  formatAppointmentWhen,
  reminderEmail,
  reminderSms,
} from "./notifications.ts";

const NOTICE = {
  toEmail: "ada@example.com",
  toPhone: "555-0100",
  clientName: "Ada Lovelace",
  businessName: "Ada's Hair Studio",
  serviceName: "Haircut",
  timezone: "America/New_York",
  startsAt: new Date("2026-09-18T16:00:00.000Z"),
  slug: "adas-hair-studio",
  isRecurring: false,
  extraWeeklyCount: 0,
};

test("formatAppointmentWhen uses the provider timezone", () => {
  assert.equal(
    formatAppointmentWhen(NOTICE.startsAt, NOTICE.timezone),
    "Friday, Sep 18 at 12:00 PM (America/New York)",
  );
});

test("confirmation email includes client, service, business, and time", () => {
  const email = confirmationEmail(NOTICE);

  assert.match(email.subject, /Ada's Hair Studio/);
  assert.match(email.text, /Ada Lovelace/);
  assert.match(email.text, /Haircut/);
  assert.match(email.text, /Ada's Hair Studio/);
  assert.match(email.text, /Friday, Sep 18 at 12:00 PM \(America\/New York\)/);
});

test("reminder email and SMS include client, service, business, and time", () => {
  const email = reminderEmail(NOTICE, "24h");
  const sms = reminderSms(NOTICE, "1h");

  assert.match(email.subject, /tomorrow/);
  assert.match(email.text, /Ada Lovelace/);
  assert.match(email.text, /Haircut/);
  assert.match(email.text, /Ada's Hair Studio/);
  assert.match(email.text, /Friday, Sep 18 at 12:00 PM \(America\/New York\)/);

  assert.match(sms, /in about an hour/);
  assert.match(sms, /Ada Lovelace/);
  assert.match(sms, /Haircut/);
  assert.match(sms, /Ada's Hair Studio/);
  assert.match(sms, /Friday, Sep 18 at 12:00 PM \(America\/New York\)/);
});
