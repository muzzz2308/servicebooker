import Link from "next/link";

import { ghostCtaClass, primaryCtaClass } from "@/components/ui";
import { plans } from "@/lib/plans";

export function PricingGrid() {
  return (
    <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <article
          key={plan.id}
          className={`flex flex-col rounded-xl border p-6 sm:p-8 ${
            plan.featured
              ? "border-moss bg-panel"
              : "border-line bg-ink"
          }`}
        >
          {plan.featured ? (
            <p className="text-xs font-medium uppercase tracking-wide text-moss-light">
              Most popular
            </p>
          ) : null}
          <h3 className="mt-2 text-xl font-semibold">{plan.name}</h3>
          <p className="mt-2 text-sm text-mist">{plan.blurb}</p>
          <p className="mt-6 text-4xl font-semibold tracking-tight">
            ${plan.price}
            <span className="text-base font-normal text-mist"> / month</span>
          </p>
          <p className="mt-6 text-xs font-medium uppercase tracking-wide text-mist">
            {plan.includesLabel}
          </p>
          <ul className="mt-3 flex-1 space-y-2 text-sm text-sand">
            {plan.includes.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className={`${plan.featured ? primaryCtaClass : ghostCtaClass} mt-8 w-full sm:w-auto`}
          >
            Start free
          </Link>
        </article>
      ))}
    </div>
  );
}
