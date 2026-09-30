"use client";

import { useState } from "react";

import {
  buttonClass,
  errorClass,
  inputClass,
  mutedClass,
} from "@/components/ui";

import { updateClientNotes } from "./actions";

export function ClientNotes({
  clientId,
  initialNotes,
}: {
  clientId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setSubmitting(true);

    try {
      const result = await updateClientNotes(clientId, notes);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSaved(true);
    } catch {
      setError("Could not save notes.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <label htmlFor={`notes-${clientId}`} className="text-sm font-medium">
        Notes
      </label>
      <textarea
        id={`notes-${clientId}`}
        rows={3}
        value={notes}
        onChange={(event) => {
          setNotes(event.target.value);
          setSaved(false);
        }}
        className={inputClass}
      />
      {error ? <p className={errorClass}>{error}</p> : null}
      {saved ? <p className={mutedClass}>Notes saved.</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className={`${buttonClass} w-auto`}
      >
        {submitting ? "Saving..." : "Save notes"}
      </button>
    </form>
  );
}
