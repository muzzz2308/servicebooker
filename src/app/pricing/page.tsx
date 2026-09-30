import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { mutedClass } from "@/components/ui";

export const metadata = {
  title: "Pricing",
  description: "Simple monthly plans for ServiceBooker.",
};

const rows = [
  ["Public booking page", true, true, true],
  ["Unlimited appointments", true, true, true],
  ["Stripe Checkout", true, true, true],
  ["Deposits", true, true, true],
  ["Client notes", true, true, true],
  ["Email reminders", true, true, true],
  ["SMS reminders", false, true, true],
  ["Recurring weekly bookings", false, true, true],
  ["Remove branding", false, false, true],
  ["Priority support", false, true, true],
] as const;

function Cell({ on }: { on: boolean }) {
  return (
    <td className="px-3 py-3 text-center text-sm">
      {on ? <span className="text-moss-light">Yes</span> : <span className="text-mist">—</span>}
    </td>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-page py-12 sm:py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-moss-light">
          Pricing
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple pricing for every business size
        </h1>
        <p className={`mt-4 max-w-2xl text-lg ${mutedClass}`}>
          Start free with no credit card. Subscribe when you are ready. Plans
          are month to month — cancel anytime.
        </p>

        <div className="mt-14">
          <PricingGrid />
        </div>

        <h2 className="mt-20 text-2xl font-semibold tracking-tight">
          Compare plans
        </h2>
        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[36rem] text-left">
            <thead className="bg-panel text-sm text-mist">
              <tr>
                <th className="px-4 py-3 font-medium">Feature</th>
                <th className="px-3 py-3 text-center font-medium">Starter</th>
                <th className="px-3 py-3 text-center font-medium">Professional</th>
                <th className="px-3 py-3 text-center font-medium">Business</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, a, b, c]) => (
                <tr key={label} className="border-t border-line">
                  <td className="px-4 py-3 text-sm">{label}</td>
                  <Cell on={a} />
                  <Cell on={b} />
                  <Cell on={c} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-16 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <dl className="mt-6 space-y-6">
            <div>
              <dt className="font-medium">What happens after I sign up?</dt>
              <dd className={`mt-1 ${mutedClass}`}>
                You set timezone, booking URL, and hours, then add services.
                Your public page is live as soon as a service is active.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Do you take a cut of bookings?</dt>
              <dd className={`mt-1 ${mutedClass}`}>
                ServiceBooker does not add a platform fee on top of Stripe.
                Stripe&apos;s processing fees still apply.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Can I change plans later?</dt>
              <dd className={`mt-1 ${mutedClass}`}>
                Yes. Move up or down whenever you want. Billing is not required
                to try the product.
              </dd>
            </div>
          </dl>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
