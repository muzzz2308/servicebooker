import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-page py-12 sm:grid-cols-2 sm:py-14 lg:grid-cols-4">
        <div>
          <p className="font-semibold tracking-tight">ServiceBooker</p>
          <p className="mt-3 text-sm text-mist">
            Online booking, payments, and reminders for independent service
            providers.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-sand">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-mist">
            <li>
              <Link href="/features" className="hover:text-sand">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-sand">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-sand">
                Start free
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-sand">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-mist">
            <li>
              <Link href="/login" className="hover:text-sand">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-sand">
                Create account
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-sand">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-sand">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-mist">
            <li>
              <Link href="/privacy" className="hover:text-sand">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-sand">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-page py-6 text-center text-xs text-mist">
        © {new Date().getFullYear()} ServiceBooker
      </div>
    </footer>
  );
}
