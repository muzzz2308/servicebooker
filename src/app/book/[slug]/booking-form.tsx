"use client";

import { formatInTimeZone } from "date-fns-tz";
import { useEffect, useState } from "react";

import {
  buttonClass,
  errorClass,
  inputClass,
  labelClass,
  mutedClass,
} from "@/components/ui";
import { chargeAmountCents } from "@/lib/booking";
import { formatCents } from "@/lib/money";
import { formatDuration } from "@/lib/schedule";
import { formatTimezoneLabel, timesInProviderZone } from "@/lib/timezone";

export type BookableService = {
  id: string;
  name: string;
  durationMins: number;
  priceCents: number;
  depositCents: number;
};

type Props = {
  slug: string;
  timezone: string;
  dates: string[];
  services: BookableService[];
};

export function BookingForm({ slug, timezone, dates, services }: Props) {
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState(dates[0] ?? "");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [slotRetry, setSlotRetry] = useState(0);
  const [startsAt, setStartsAt] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const service = services.find((item) => item.id === serviceId) ?? null;

  useEffect(() => {
    setStartsAt(null);
    setSlots([]);
    setSlotError(null);

    if (!serviceId || !date) {
      return;
    }

    const controller = new AbortController();
    setSlotsLoading(true);

    fetch(
      `/api/availability?slug=${encodeURIComponent(slug)}&serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        const data = (await response.json()) as { slots?: string[]; error?: string };

        if (!response.ok) {
          setSlotError(data.error ?? "Could not load times.");
          return;
        }

        setSlots(data.slots ?? []);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSlotError("Could not load times.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setSlotsLoading(false);
        }
      });

    return () => controller.abort();
  }, [slug, serviceId, date, slotRetry]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!service || !startsAt) {
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          serviceId: service.id,
          startsAt,
          name,
          email,
          phone,
          isRecurring,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        url?: string;
        error?: string;
      } | null;

      if (!response.ok || !data?.url) {
        setSubmitError(data?.error ?? "Could not start checkout.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (services.length === 0) {
    return (
      <p className={`mt-6 ${mutedClass}`}>
        This business hasn&apos;t listed any services yet.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          Choose a service
        </h2>
        <ul className="mt-3 space-y-2">
          {services.map((item) => {
            const selected = item.id === serviceId;
            const amount = chargeAmountCents(item);

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setServiceId(item.id)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    selected
                      ? "border-moss bg-moss/10"
                      : "border-line hover:border-moss"
                  }`}
                >
                  <span className="font-medium">{item.name}</span>
                  <span className={`mt-1 block ${mutedClass}`}>
                    {formatDuration(item.durationMins)} &middot;{" "}
                    {item.depositCents > 0
                      ? `${formatCents(amount)} deposit`
                      : formatCents(amount)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {service ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            Pick a date
          </h2>
          <label htmlFor="booking-date" className={`mt-3 ${labelClass}`}>
            Date
          </label>
          <input
            id="booking-date"
            type="date"
            min={dates[0]}
            max={dates[dates.length - 1]}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={`${inputClass} max-w-xs`}
          />
          <p className={`mt-1 ${mutedClass}`}>
            {timesInProviderZone(timezone)}
          </p>
        </section>
      ) : null}

      {service && date ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            Available times
          </h2>

          {slotsLoading ? (
            <p className={`mt-3 ${mutedClass}`} aria-live="polite">
              Loading available times...
            </p>
          ) : null}

          {slotError ? (
            <div className="mt-3 space-y-2">
              <p className={errorClass}>{slotError}</p>
              <button
                type="button"
                onClick={() => setSlotRetry((count) => count + 1)}
                className="text-sm text-moss-light underline"
              >
                Try again
              </button>
            </div>
          ) : null}

          {!slotsLoading && !slotError && slots.length === 0 ? (
            <p className={`mt-3 ${mutedClass}`}>
              No times available on this day. Try another date.
            </p>
          ) : null}

          {slots.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {slots.map((slot) => {
                const selected = slot === startsAt;

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setStartsAt(slot)}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      selected
                        ? "border-moss bg-moss text-ink"
                        : "border-line hover:border-moss"
                    }`}
                  >
                    {formatInTimeZone(slot, timezone, "h:mm a")}
                  </button>
                );
              })}
            </div>
          ) : null}
        </section>
      ) : null}

      {service && startsAt ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            Your details
          </h2>
          <p className={`mt-1 ${mutedClass}`}>
            {service.name} on{" "}
            {formatInTimeZone(startsAt, timezone, "EEEE, MMM d")} at{" "}
            {formatInTimeZone(startsAt, timezone, "h:mm a")} (
            {formatTimezoneLabel(timezone)}).
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {submitError ? <p className={errorClass}>{submitError}</p> : null}

            <div>
              <label htmlFor="client-name" className={labelClass}>
                Name
              </label>
              <input
                id="client-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="client-email" className={labelClass}>
                Email
              </label>
              <input
                id="client-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="client-phone" className={labelClass}>
                Phone
              </label>
              <input
                id="client-phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={inputClass}
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(event) => setIsRecurring(event.target.checked)}
                className="h-4 w-4"
              />
              Repeat weekly
            </label>

            <button type="submit" disabled={submitting} className={buttonClass}>
              {submitting
                ? "Redirecting to checkout..."
                : `Pay ${formatCents(chargeAmountCents(service))} and book`}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
