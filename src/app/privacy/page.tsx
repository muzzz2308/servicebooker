import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { mutedClass } from "@/components/ui";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-page py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
        <p className={`mt-4 ${mutedClass}`}>
          ServiceBooker stores the account details you provide (name, email,
          business name), the services and hours you configure, and the client
          contact information submitted at booking. Payment card data is
          handled by Stripe, not stored on ServiceBooker servers. We use this
          data only to run bookings, reminders, and your dashboard.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
