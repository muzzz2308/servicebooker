"use client";

import { useState } from "react";

import {
  buttonClass,
  errorClass,
  inputClass,
  labelClass,
  mutedClass,
} from "@/components/ui";

import type { ServiceActionResult, ServiceFormInput } from "./actions";

type Props = {
  idPrefix: string;
  initialValues?: ServiceFormInput;
  submitLabel: string;
  onSubmit: (input: ServiceFormInput) => Promise<ServiceActionResult>;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const emptyValues: ServiceFormInput = {
  name: "",
  durationMins: "60",
  price: "",
  deposit: "0",
  isActive: true,
};

export function ServiceForm({
  idPrefix,
  initialValues = emptyValues,
  submitLabel,
  onSubmit,
  onSuccess,
  onCancel,
}: Props) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(patch: Partial<ServiceFormInput>) {
    setValues((current) => ({ ...current, ...patch }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await onSubmit(values);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onSuccess?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <p className={errorClass}>{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-name`} className={labelClass}>
            Service name
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            required
            value={values.name}
            onChange={(event) => update({ name: event.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-duration`} className={labelClass}>
            Duration (minutes)
          </label>
          <input
            id={`${idPrefix}-duration`}
            type="number"
            inputMode="numeric"
            min={1}
            max={1440}
            step={1}
            required
            value={values.durationMins}
            onChange={(event) => update({ durationMins: event.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-price`} className={labelClass}>
            Price (dollars)
          </label>
          <input
            id={`${idPrefix}-price`}
            type="text"
            inputMode="decimal"
            required
            placeholder="75.00"
            value={values.price}
            onChange={(event) => update({ price: event.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-deposit`} className={labelClass}>
            Deposit (dollars)
          </label>
          <input
            id={`${idPrefix}-deposit`}
            type="text"
            inputMode="decimal"
            required
            placeholder="0.00"
            value={values.deposit}
            onChange={(event) => update({ deposit: event.target.value })}
            className={inputClass}
          />
          <p className={`mt-1 ${mutedClass}`}>
            0 means clients pay in full upfront.
          </p>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(event) => update({ isActive: event.target.checked })}
              className="h-4 w-4"
            />
            Active and bookable
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className={`${buttonClass} w-auto`}
        >
          {submitting ? "Saving..." : submitLabel}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="text-sm text-mist hover:text-sand disabled:opacity-50"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
