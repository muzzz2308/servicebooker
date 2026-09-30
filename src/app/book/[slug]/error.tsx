"use client";

import { buttonClass, cardClass, mutedClass } from "@/components/ui";

export default function BookError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-md p-6 py-12">
      <div className={cardClass}>
        <h1 className="text-2xl font-semibold tracking-tight">
          Could not load this page
        </h1>
        <p className={`mt-2 ${mutedClass}`}>
          Something went wrong while loading the booking page. Try again.
        </p>
        <button type="button" onClick={reset} className={`${buttonClass} mt-6`}>
          Try again
        </button>
      </div>
    </main>
  );
}
