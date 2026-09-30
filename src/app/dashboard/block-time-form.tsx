"use client";

import { useState } from "react";

import {
  buttonClass,
  errorClass,
  inputClass,
  labelClass,
  mutedClass,
} from "@/components/ui";
import { timesInProviderZone } from "@/lib/timezone";

import { createTimeOff } from "./actions";

export function BlockTimeForm({
  defaultDate,
  timezone,
}: {
  defaultDate: string;
  timezone: string;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${buttonClass} w-auto`}
      >
        Block off time
      </button>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await createTimeOff({ date, startTime, endTime, reason });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setOpen(false);
      setReason("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 rounded-lg border border-line p-5"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide">
        Block off time
      </h2>
      <p className={mutedClass}>
        Clients will not be able to book during this window.{" "}
        {timesInProviderZone(timezone)}
      </p>

      {error ? <p className={errorClass}>{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="timeoff-date" className={labelClass}>
            Date
          </label>
          <input
            id="timeoff-date"
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="timeoff-start" className={labelClass}>
            Start
          </label>
          <input
            id="timeoff-start"
            type="time"
            required
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="timeoff-end" className={labelClass}>
            End
          </label>
          <input
            id="timeoff-end"
            type="time"
            required
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="timeoff-reason" className={labelClass}>
          Reason (optional)
        </label>
        <input
          id="timeoff-reason"
          type="text"
          maxLength={200}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className={`${buttonClass} w-auto`}
        >
          {submitting ? "Saving..." : "Save block"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-mist hover:text-sand"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
