import Link from "next/link";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { mutedClass, primaryCtaClass } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className={mutedClass}>
          That page doesn&apos;t exist. Check the link and try again.
        </p>
        <Link href="/" className={primaryCtaClass}>
          Go home
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
