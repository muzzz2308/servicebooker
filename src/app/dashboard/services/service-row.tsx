"use client";

import { useState, useTransition } from "react";

import { errorClass, mutedClass } from "@/components/ui";
import { centsToDollars, formatCents } from "@/lib/money";
import { formatDuration } from "@/lib/schedule";

import { deleteService, updateService } from "./actions";
import { ServiceForm } from "./service-form";

export type ServiceListItem = {
  id: string;
  name: string;
  durationMins: number;
  priceCents: number;
  depositCents: number;
  isActive: boolean;
};

export function ServiceRow({ service }: { service: ServiceListItem }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, startDelete] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Delete "${service.name}"? This cannot be undone.`)) {
      return;
    }

    setError(null);
    startDelete(async () => {
      const result = await deleteService(service.id);

      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  if (editing) {
    return (
      <li className="py-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
          Edit {service.name}
        </h3>

        <ServiceForm
          idPrefix={`service-${service.id}`}
          initialValues={{
            name: service.name,
            durationMins: String(service.durationMins),
            price: centsToDollars(service.priceCents),
            deposit: centsToDollars(service.depositCents),
            isActive: service.isActive,
          }}
          submitLabel="Save changes"
          onSubmit={(input) => updateService(service.id, input)}
          onSuccess={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div>
        <p className="flex items-center gap-2 font-medium">
          {service.name}
          {service.isActive ? null : (
            <span className="rounded-full border border-line px-2 py-0.5 text-xs font-normal">
              Inactive
            </span>
          )}
        </p>
        <p className={`mt-1 ${mutedClass}`}>
          {formatDuration(service.durationMins)} &middot;{" "}
          {formatCents(service.priceCents)} &middot;{" "}
          {service.depositCents === 0
            ? "paid in full upfront"
            : `${formatCents(service.depositCents)} deposit`}
        </p>
        {error ? <p className={`mt-2 ${errorClass}`}>{error}</p> : null}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-sm text-moss-light underline"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-300 underline disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}
