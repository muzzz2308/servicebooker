import Image from "next/image";
import Link from "next/link";

import { ghostCtaClass, primaryCtaClass } from "@/components/ui";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-moss/20 blur-3xl sm:h-80 sm:w-80 animate-glow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 top-24 hidden h-[28rem] w-[28rem] rounded-full bg-moss/10 blur-3xl sm:block animate-glow"
        aria-hidden
      />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-page py-10 sm:gap-10 sm:py-12 lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-16">
        <div className="min-w-0">
          <p className="animate-fade-up inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-panel/80 px-3 py-1 text-[11px] text-moss-light sm:text-xs">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss-light opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-moss" />
            </span>
            <span className="min-w-0 leading-snug">
              Booking software for people who show up
            </span>
          </p>
          <h1 className="animate-fade-up-delayed mt-5 max-w-xl text-[2.05rem] font-semibold leading-[1.12] tracking-tight text-balance sm:mt-6 sm:text-5xl sm:leading-[1.08] lg:text-6xl lg:leading-[1.05]">
            The booking experience your clients{" "}
            <span className="text-moss-light">already expect.</span>
          </h1>
          <p className="animate-fade-up-late mt-4 max-w-xl text-base leading-relaxed text-mist sm:mt-6 sm:text-lg">
            Publish a page, take card payments, and keep the week on one
            schedule — built for independent providers, not enterprise field
            teams.
          </p>
          <div className="animate-fade-up-late mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link
              href="/signup"
              className={`${primaryCtaClass} cta-shine w-full sm:w-auto`}
            >
              Start free
            </Link>
            <Link href="/pricing" className={`${ghostCtaClass} w-full sm:w-auto`}>
              See pricing
            </Link>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-mist sm:mt-5">
            <span>No credit card required</span>
            <span>Stripe Checkout</span>
            <span>Your timezone</span>
          </p>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md min-[480px]:aspect-[5/6] sm:aspect-auto sm:h-[32rem] sm:max-w-lg lg:max-w-none">
          <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] border border-line shadow-[0_40px_90px_-36px_rgba(0,0,0,0.9)] sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[78%] sm:rounded-[2rem]">
            <Image
              src="/marketing/hero-stylist.png"
              alt="Stylist cutting hair in a dim salon"
              fill
              priority
              className="object-cover animate-ken"
              sizes="(min-width: 1024px) 28rem, (min-width: 640px) 70vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10" />
          </div>

          <div className="absolute bottom-6 left-0 hidden w-36 overflow-hidden rounded-2xl border border-line shadow-2xl md:block lg:w-40 animate-float-delayed">
            <div className="relative aspect-[3/4]">
              <Image
                src="/marketing/hero-nails.png"
                alt="Nail artist at work"
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          </div>

          <div className="absolute left-8 top-8 hidden overflow-hidden rounded-xl border border-line shadow-2xl md:block animate-float">
            <div className="relative h-20 w-28">
              <Image
                src="/marketing/hero-field.png"
                alt="Technician installing a fixture"
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
          </div>

          <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-line bg-panel/95 p-3 shadow-2xl backdrop-blur sm:inset-x-auto sm:-right-1 sm:bottom-auto sm:top-10 sm:w-[min(calc(100%-1.5rem),17.5rem)] sm:p-4 animate-float">
            <div className="flex items-center justify-between gap-3 text-xs text-mist">
              <span>Today</span>
              <span className="shrink-0 text-moss-light">3 jobs · $240</span>
            </div>
            <ul className="mt-3 space-y-2">
              {[
                ["9:00 AM", "Ada L.", "Haircut"],
                ["11:30 AM", "Sam R.", "Color"],
                ["3:00 PM", "Jordan P.", "Lesson"],
              ].map(([time, name, service]) => (
                <li
                  key={time}
                  className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-2 rounded-lg bg-ink/80 px-2.5 py-2 text-[11px] sm:px-3 sm:text-xs"
                >
                  <span className="text-mist">{time}</span>
                  <span className="truncate font-medium">{name}</span>
                  <span className="text-moss-light">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute bottom-36 right-4 hidden rounded-full border border-line bg-ink/90 px-3 py-1.5 text-xs text-moss-light shadow-lg md:block animate-float-delayed">
            Paid · $85 deposit
          </div>
        </div>
      </div>
    </section>
  );
}
