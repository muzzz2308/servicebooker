"use client";

import { useState } from "react";

import { buttonClass } from "@/components/ui";

import { createService } from "./actions";
import { ServiceForm } from "./service-form";

export function AddService() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${buttonClass} w-auto`}
      >
        Add a service
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-line p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">
        New service
      </h2>

      <ServiceForm
        idPrefix="new-service"
        submitLabel="Create service"
        onSubmit={createService}
        onSuccess={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
