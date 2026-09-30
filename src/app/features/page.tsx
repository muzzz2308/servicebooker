import Link from "next/link";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { mutedClass, primaryCtaClass } from "@/components/ui";

export const metadata = {
  title: "Product",
  description: "What ServiceBooker includes for providers and their clients.",
};

const blocks = [
  {
    title: "Online booking",
    items: [
      "Shareable /book/your-business page",
      "Services with duration, price, and deposit",
      "Available times computed from your hours, time off, and existing jobs",
      "Times labeled in your timezone, not the client’s device clock",
      "Optional weekly recurring bookings",
    ],
  },
  {
    title: "Payments",
    items: [
      "Stripe Checkout for card payments",
      "Charge the full price or a deposit",
      "Appointments created only after payment succeeds",
      "Idempotent webhooks so a retry does not double-book",
    ],
  },
  {
    title: "Schedule",
    items: [
      "Today and this week on the dashboard",
      "Mark appointments completed, cancelled, or no-show",
      "Block off time so those windows cannot be booked",
    ],
  },
  {
    title: "Clients & reminders",
    items: [
      "Client list scoped to your business",
      "Appointment history and private notes",
      "Email and SMS reminders ~24 hours and ~1 hour before start",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-page py-12 sm:py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-moss-light">
          Product
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to take bookings without the extra field-service
          weight.
        </h1>
        <p className={`mt-4 max-w-2xl text-lg ${mutedClass}`}>
          ServiceBooker is the public page, the payment, the calendar, and the
          reminder — owned by one provider account.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {blocks.map((block) => (
            <article
              key={block.title}
              className="rounded-xl border border-line bg-panel p-6 sm:p-8"
            >
              <h2 className="text-xl font-semibold">{block.title}</h2>
              <ul className="mt-4 space-y-2 text-sm text-mist">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                    <span className="text-sand">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-line bg-panel px-8 py-10 text-center">
          <h2 className="text-2xl font-semibold">Ready to publish a page?</h2>
          <p className={`mx-auto mt-2 max-w-lg ${mutedClass}`}>
            Set up takes a few minutes. Add one service and you can take a
            paid booking.
          </p>
          <Link href="/signup" className={`${primaryCtaClass} mt-6`}>
            Start free
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
