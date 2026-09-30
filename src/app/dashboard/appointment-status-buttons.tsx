"use client";

import { useState, useTransition } from "react";

import { errorClass } from "@/components/ui";
import type { UpdatableStatus } from "@/lib/schedule-window";

import { updateAppointmentStatus } from "./actions";

const ACTIONS: { status: UpdatableStatus; label: string }[] = [
  { status: "completed", label: "Completed" },
  { status: "no_show", label: "No-show" },
  { status: "cancelled", label: "Cancel" },
];

export function AppointmentStatusButtons({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function apply(status: UpdatableStatus) {
    if (status === "cancelled" && !window.confirm("Cancel this appointment?")) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await updateAppointmentStatus(appointmentId, status);

      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-3 text-sm">
        {ACTIONS.map((action) => (
          <button
            key={action.status}
            type="button"
            disabled={pending}
            onClick={() => apply(action.status)}
            className="text-moss-light underline disabled:opacity-50"
          >
            {action.label}
          </button>
        ))}
      </div>
      {error ? <p className={errorClass}>{error}</p> : null}
    </div>
  );
}
