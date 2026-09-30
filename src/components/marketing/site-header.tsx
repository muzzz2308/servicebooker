"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { primaryCtaClass } from "@/components/ui";

const links = [
  { href: "/features", label: "Product", hint: "Booking, pay, remind" },
  { href: "/pricing", label: "Pricing", hint: "Simple monthly plans" },
  { href: "/login", label: "Sign in", hint: "Open your schedule" },
];

export function SiteHeader() {
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

  const menu =
    open && mounted
      ? createPortal(
          <div
            id={menuId}
            className="fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col overflow-y-auto bg-ink sm:top-16 md:hidden"
            style={{ backgroundColor: "#0c0f0c" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,154,109,0.18),transparent_46%)]" />
            <nav className="relative flex min-h-full flex-1 flex-col px-page py-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-mist">
                Menu
              </p>
              <ul className="mt-6 space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-baseline justify-between gap-4 border-b border-line py-5 text-sand"
                      onClick={() => setOpen(false)}
                    >
                      <span className="text-3xl font-semibold tracking-tight">
                        {link.label}
                      </span>
                      <span className="text-xs text-mist">{link.hint}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8">
                <Link
                  href="/signup"
                  className={`${primaryCtaClass} w-full py-3 text-base`}
                  onClick={() => setOpen(false)}
                >
                  Start free
                </Link>
                <p className="mt-3 text-center text-xs text-mist">
                  No credit card required
                </p>
              </div>
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-page py-3 sm:gap-4 sm:py-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-moss text-sm font-bold text-ink">
            S
          </span>
          <span className="truncate">ServiceBooker</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-mist md:flex">
          {links.slice(0, 2).map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-sand">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="hover:text-sand">
            Sign in
          </Link>
          <Link href="/signup" className={primaryCtaClass}>
            Start free
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="flex h-3.5 w-5 flex-col justify-between" aria-hidden>
            <span
              className={`h-0.5 w-5 rounded-full bg-sand transition duration-300 ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-sand transition duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-sand transition duration-300 ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>
      {menu}
    </header>
  );
}
