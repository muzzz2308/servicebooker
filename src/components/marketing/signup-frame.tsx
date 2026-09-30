import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function SignupFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-svh overflow-x-clip bg-ink">
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        aria-hidden
      >
        <span className="absolute right-[8%] top-[12%] h-16 w-40 rounded-lg bg-panel" />
        <span className="absolute right-[22%] top-[8%] h-10 w-24 rounded-lg bg-moss/20" />
        <span className="absolute bottom-[18%] right-[6%] h-14 w-32 rounded-lg bg-panel" />
        <span className="absolute bottom-[28%] right-[28%] h-8 w-20 rounded-lg bg-moss/15" />
        <span className="absolute right-[4%] top-[42%] h-12 w-16 rounded-lg bg-line" />
      </div>

      <div className="relative mx-auto grid min-h-svh max-w-6xl items-center gap-10 px-page py-10 lg:grid-cols-2 lg:gap-16">
        <div className="mx-auto w-full max-w-[28rem] rounded-2xl bg-sand p-7 text-ink shadow-2xl sm:p-9">
          {children}
        </div>

        <div className="relative mx-auto hidden w-full max-w-lg lg:block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
            <Image
              src="/marketing/hero-field.png"
              alt="Technician at a home visit"
              fill
              priority
              className="object-cover"
              sizes="40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" />
          </div>

          <div className="absolute left-4 top-10 rounded-xl bg-moss px-3 py-2 text-ink shadow-lg">
            <p className="text-[11px] font-semibold">10:30 AM</p>
            <p className="text-[10px] opacity-80">Haircut · paid</p>
            <span className="mt-2 block h-1.5 w-24 rounded-full bg-ink/20" />
          </div>
          <div className="absolute right-6 top-28 rounded-lg bg-panel px-3 py-1.5 text-xs text-sand shadow-lg">
            New booking
          </div>
          <div className="absolute bottom-16 left-8 flex items-center gap-2 rounded-xl bg-panel/95 px-3 py-2 text-sand shadow-lg">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-moss text-ink">
              ✓
            </span>
            <span className="space-y-1">
              <span className="block h-1.5 w-16 rounded-full bg-sand/40" />
              <span className="block h-1.5 w-10 rounded-full bg-sand/25" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignupBrand() {
  return (
    <Link href="/" className="mb-8 inline-flex items-center gap-2 font-semibold">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-moss text-sm font-bold">
        S
      </span>
      ServiceBooker
    </Link>
  );
}
