import { formatInTimeZone } from "date-fns-tz";
import { Resend } from "resend";
import twilio from "twilio";

import { formatTimezoneLabel } from "./timezone.ts";

export type AppointmentNotice = {
  toEmail: string;
  toPhone: string;
  clientName: string;
  businessName: string;
  serviceName: string;
  timezone: string;
  startsAt: Date;
};

export type BookingNotice = AppointmentNotice & {
  slug: string;
  isRecurring: boolean;
  extraWeeklyCount: number;
};

export type ReminderKind = "24h" | "1h";

const RESEND_FROM = "ServiceBooker <beth.t@example.com>";

function origin() {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

function timezoneSafe(timezone: string) {
  return timezone || "UTC";
}

export function formatAppointmentWhen(startsAt: Date, timezone: string) {
  const zone = timezoneSafe(timezone);

  return `${formatInTimeZone(startsAt, zone, "EEEE, MMM d 'at' h:mm a")} (${formatTimezoneLabel(zone)})`;
}

export function confirmationEmail(notice: BookingNotice) {
  const when = formatAppointmentWhen(notice.startsAt, notice.timezone);
  const weekly = notice.isRecurring
    ? ` This booking repeats weekly for ${notice.extraWeeklyCount + 1} weeks.`
    : "";

  return {
    subject: `Booking confirmed — ${notice.businessName}`,
    text: `Hi ${notice.clientName}, your ${notice.serviceName} with ${notice.businessName} is confirmed for ${when}.${weekly} Details: ${origin()}/book/${notice.slug}/confirm`,
  };
}

export function confirmationSms(notice: BookingNotice) {
  return confirmationEmail(notice).text;
}

export function reminderEmail(notice: AppointmentNotice, kind: ReminderKind) {
  const when = formatAppointmentWhen(notice.startsAt, notice.timezone);
  const whenPhrase =
    kind === "24h" ? "tomorrow" : "in about an hour";

  return {
    subject:
      kind === "24h"
        ? `Reminder: appointment tomorrow at ${notice.businessName}`
        : `Reminder: appointment in 1 hour at ${notice.businessName}`,
    text: `Hi ${notice.clientName}, reminder that your ${notice.serviceName} with ${notice.businessName} is ${whenPhrase} — ${when}.`,
  };
}

export function reminderSms(notice: AppointmentNotice, kind: ReminderKind) {
  return reminderEmail(notice, kind).text;
}

export function toE164(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  if (digits.length >= 8) {
    return `+${digits}`;
  }

  return null;
}

export async function sendEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: RESEND_FROM,
    to,
    subject,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendSms(toPhone: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const to = toE164(toPhone);

  if (!sid || !token || !from || !to) {
    return;
  }

  const client = twilio(sid, token);
  await client.messages.create({ from, to, body });
}

async function deliver(toEmail: string, toPhone: string, subject: string, text: string) {
  const results = await Promise.allSettled([
    sendEmail(toEmail, subject, text),
    sendSms(toPhone, text),
  ]);

  let ok = true;

  for (const result of results) {
    if (result.status === "rejected") {
      ok = false;
      console.error("Notification failed:", result.reason);
    }
  }

  return ok;
}

/** Best-effort; missing credentials or provider errors must not fail the webhook. */
export async function sendBookingConfirmations(notice: BookingNotice) {
  const email = confirmationEmail(notice);
  await deliver(notice.toEmail, notice.toPhone, email.subject, confirmationSms(notice));
}

export async function sendAppointmentReminder(
  notice: AppointmentNotice,
  kind: ReminderKind,
) {
  const email = reminderEmail(notice, kind);
  return deliver(notice.toEmail, notice.toPhone, email.subject, reminderSms(notice, kind));
}
