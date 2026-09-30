import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { mutedClass } from "@/components/ui";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-page py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Terms</h1>
        <p className={`mt-4 ${mutedClass}`}>
          ServiceBooker is provided as-is for scheduling and collecting
          payments for your own services. You are responsible for the services
          you list, the prices you charge, and how you handle cancellations.
          Stripe processes card payments under their terms. Do not use the
          product for anything illegal or to book on behalf of a business you
          do not operate.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
