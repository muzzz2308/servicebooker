"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  buttonClass,
  errorClass,
  inputClass,
  labelClass,
  mutedClass,
} from "@/components/ui";
import { DAY_LABELS, type WorkingDay } from "@/lib/schedule";
import { slugify } from "@/lib/slug";
import { formatTimezoneLabel } from "@/lib/timezone";

type SlugStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "available" }
  | { state: "unavailable"; message: string };

type Props = {
  businessName: string;
  initialTimezone: string;
  initialSlug: string;
  initialDays: WorkingDay[];
  timezones: string[];
};

export function OnboardingForm({
  businessName,
  initialTimezone,
  initialSlug,
  initialDays,
  timezones,
}: Props) {
  const router = useRouter();
  const [timezone, setTimezone] = useState(initialTimezone);
  const [slug, setSlug] = useState(initialSlug);
  const [days, setDays] = useState(initialDays);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>({ state: "idle" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const suggestion = slugify(businessName);

  useEffect(() => {
    if (!slug) {
      setSlugStatus({ state: "idle" });
      return;
    }

    setSlugStatus({ state: "checking" });
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/slug-check?slug=${encodeURIComponent(slug)}`,
          { signal: controller.signal },
        );
        const data = (await response.json()) as {
          available?: boolean;
          error?: string;
        };

        setSlugStatus(
          data.available
            ? { state: "available" }
            : { state: "unavailable", message: data.error ?? "That URL is taken." },
        );
      } catch {
        // Aborted by a newer keystroke, or the request failed; stay quiet and
        // let the server validate on submit.
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [slug]);

  function updateDay(dayOfWeek: number, patch: Partial<WorkingDay>) {
    setDays((current) =>
      current.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, ...patch } : day,
      ),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone, slug, days }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error ?? "Could not save your details.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {error ? <p className={errorClass}>{error}</p> : null}

      <div>
        <label htmlFor="timezone" className={labelClass}>
          Timezone
        </label>
        <select
          id="timezone"
          value={timezone}
          onChange={(event) => setTimezone(event.target.value)}
          className={inputClass}
        >
          {timezones.map((zone) => (
            <option key={zone} value={zone}>
              {zone.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <p className={`mt-1 ${mutedClass}`}>
          Booking times are shown to clients in this timezone.
        </p>
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>
          Booking URL
        </label>
        <div className="mt-1 flex items-center gap-2">
          <span className={mutedClass}>/book/</span>
          <input
            id="slug"
            type="text"
            required
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            className={`${inputClass} mt-0`}
          />
        </div>
        <p className={`mt-1 ${mutedClass}`}>
          {slugStatus.state === "checking" && "Checking availability..."}
          {slugStatus.state === "available" && "This URL is available."}
          {slugStatus.state === "idle" && "Lowercase letters, numbers and hyphens."}
        </p>
        {slugStatus.state === "unavailable" ? (
          <p className="mt-1 text-sm text-red-300">
            {slugStatus.message}
          </p>
        ) : null}
        {suggestion && suggestion !== slug ? (
          <button
            type="button"
            onClick={() => setSlug(suggestion)}
            className="mt-2 text-sm text-moss-light underline"
          >
            Use {suggestion}
          </button>
        ) : null}
      </div>

      <div>
        <p className={labelClass}>Working hours</p>
        <p className={`mt-1 ${mutedClass}`}>
          Hours are in {formatTimezoneLabel(timezone)} (the timezone you chose
          above), not your device&apos;s local time. Uncheck a day to mark it
          closed.
        </p>

        <ul className="mt-3 divide-y divide-line">
          {days.map((day) => (
            <li
              key={day.dayOfWeek}
              className="flex flex-wrap items-center gap-3 py-3"
            >
              <label className="flex w-36 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={day.isOpen}
                  onChange={(event) =>
                    updateDay(day.dayOfWeek, { isOpen: event.target.checked })
                  }
                  className="h-4 w-4"
                />
                {DAY_LABELS[day.dayOfWeek]}
              </label>

              {day.isOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    required
                    aria-label={`${DAY_LABELS[day.dayOfWeek]} start time`}
                    value={day.startTime}
                    onChange={(event) =>
                      updateDay(day.dayOfWeek, { startTime: event.target.value })
                    }
                    className={`${inputClass} mt-0 w-auto`}
                  />
                  <span className={mutedClass}>to</span>
                  <input
                    type="time"
                    required
                    aria-label={`${DAY_LABELS[day.dayOfWeek]} end time`}
                    value={day.endTime}
                    onChange={(event) =>
                      updateDay(day.dayOfWeek, { endTime: event.target.value })
                    }
                    className={`${inputClass} mt-0 w-auto`}
                  />
                </div>
              ) : (
                <span className={mutedClass}>Closed</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        disabled={submitting || slugStatus.state === "unavailable"}
        className={buttonClass}
      >
        {submitting ? "Saving..." : "Finish setup"}
      </button>
    </form>
  );
}
