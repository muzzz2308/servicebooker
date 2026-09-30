"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { SignOutButton } from "@/app/dashboard/sign-out-button";

type ProviderInfo = {
  name: string;
  businessName: string;
  slug: string;
};

const operate = [
  { href: "/dashboard", label: "Dashboard", exact: true },
  { href: "/dashboard/schedule", label: "Schedule", exact: false },
  { href: "/dashboard/clients", label: "Clients", exact: false },
  { href: "/dashboard/services", label: "Services", exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    className: "h-4 w-4 shrink-0",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "Dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case "Schedule":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "Clients":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19c0-2.8 2.7-5 6-5s6 2.2 6 5" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M21 19c0-2-1.8-3.6-4-4" />
        </svg>
      );
    case "Services":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.8-2.8 2.1-2.1Z" />
        </svg>
      );
    case "Hours":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8 12h8" />
        </svg>
      );
  }
}

function SidebarBody({
  provider,
  onNavigate,
}: {
  provider: ProviderInfo;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const initial = provider.businessName.trim().charAt(0).toUpperCase() || "S";

  return (
    <>
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-2 px-4 py-4 font-semibold tracking-tight"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-moss text-sm font-bold text-ink">
          S
        </span>
        ServiceBooker
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Dashboard">
        <p className="px-2 pb-2 pt-1 text-[11px] uppercase tracking-[0.22em] text-mist">
          Business
        </p>
        <ul className="space-y-0.5">
          {operate.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm ${
                    active
                      ? "bg-moss/15 font-medium text-moss-light"
                      : "text-mist hover:bg-white/5 hover:text-sand"
                  }`}
                >
                  <NavIcon name={item.label} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="px-2 pb-2 pt-6 text-[11px] uppercase tracking-[0.22em] text-mist">
          Booking
        </p>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/onboarding"
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm ${
                pathname.startsWith("/onboarding")
                  ? "bg-moss/15 font-medium text-moss-light"
                  : "text-mist hover:bg-white/5 hover:text-sand"
              }`}
            >
              <NavIcon name="Hours" />
              Hours
            </Link>
          </li>
          <li>
            <Link
              href={`/book/${provider.slug}`}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-mist hover:bg-white/5 hover:text-sand"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="h-4 w-4 shrink-0"
                aria-hidden
              >
                <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5.93" />
                <path d="M14 11a5 5 0 0 0-7.07 0L5.52 12.4a5 5 0 0 0 7.07 7.07L14 18.07" />
              </svg>
              Online booking
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto border-t border-line px-3 py-3">
        <div className="flex items-center gap-3 rounded-lg px-1 py-1">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-moss/20 text-sm font-semibold text-moss-light">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{provider.name}</p>
            <p className="truncate text-xs text-mist">{provider.businessName}</p>
          </div>
        </div>
        <div className="mt-2 px-1">
          <SignOutButton />
        </div>
      </div>
    </>
  );
}

export function DashboardShell({
  provider,
  children,
}: {
  provider: ProviderInfo;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const drawer =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ink/70"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <aside
              id={menuId}
              className="relative flex h-full w-[16.5rem] flex-col border-r border-line bg-panel"
            >
              <SidebarBody
                provider={provider}
                onNavigate={() => setOpen(false)}
              />
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="min-h-screen bg-ink lg:flex">
      <aside className="sticky top-0 hidden h-svh w-[16.5rem] shrink-0 flex-col border-r border-line bg-panel lg:flex">
        <SidebarBody provider={provider} />
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-ink/90 px-page py-3 backdrop-blur lg:hidden">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-moss text-sm font-bold text-ink">
              S
            </span>
            ServiceBooker
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="flex h-3.5 w-5 flex-col justify-between" aria-hidden>
              <span className="h-0.5 w-5 rounded-full bg-sand" />
              <span className="h-0.5 w-5 rounded-full bg-sand" />
              <span className="h-0.5 w-5 rounded-full bg-sand" />
            </span>
          </button>
        </header>
        {drawer}
        <div className="mx-auto max-w-5xl px-page py-6 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
