import Link from "next/link";

export type SetupStep = {
  href: string;
  title: string;
  body: string;
  done: boolean;
};

export function SetupChecklist({ steps }: { steps: SetupStep[] }) {
  const remaining = steps.filter((step) => !step.done).length;

  if (remaining === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold tracking-tight">
          Finish setting up your account
        </h2>
        <p className="mt-1 text-sm text-mist">
          {remaining} {remaining === 1 ? "step" : "steps"} left so clients can
          book a real slot.
        </p>
      </div>
      <ol>
        {steps.map((step, index) => (
          <li key={step.title} className="border-b border-line last:border-b-0">
            <Link
              href={step.href}
              className="flex items-start gap-4 px-5 py-4 transition hover:bg-white/[0.03] sm:px-6"
            >
              {step.done ? (
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-moss text-ink">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    aria-hidden
                  >
                    <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                  </svg>
                  <span className="sr-only">Done</span>
                </span>
              ) : (
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-xs font-semibold text-mist">
                  {index + 1}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-sm font-medium ${step.done ? "text-mist line-through" : ""}`}
                >
                  {step.title}
                </span>
                <span className="mt-0.5 block text-sm text-mist">{step.body}</span>
              </span>
              <span className="mt-1 text-mist" aria-hidden>
                ›
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
