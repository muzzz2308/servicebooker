"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export function NewButton({ bookingHref }: { bookingHref: string }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 rounded-md bg-moss-light px-4 py-2 text-sm font-semibold text-ink transition hover:bg-moss"
      >
        New
        <span aria-hidden className="text-base leading-none">
          +
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-lg border border-line bg-panel py-1 shadow-lg"
        >
          <Link
            role="menuitem"
            href="/dashboard/services"
            className="block px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            Add a service
          </Link>
          <Link
            role="menuitem"
            href="/dashboard/schedule"
            className="block px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            Block time off
          </Link>
          <Link
            role="menuitem"
            href={bookingHref}
            className="block px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            Open booking page
          </Link>
        </div>
      ) : null}
    </div>
  );
}
