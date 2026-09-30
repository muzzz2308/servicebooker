import Image from "next/image";
import Link from "next/link";

import { BookingPreview } from "@/components/marketing/booking-preview";
import { HomeAtmosphere } from "@/components/marketing/home-atmosphere";
import { HomeHero } from "@/components/marketing/home-hero";
import { IndustryMarquee } from "@/components/marketing/industry-marquee";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { Reveal } from "@/components/marketing/reveal";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { mutedClass, primaryCtaClass } from "@/components/ui";

const stats = [
  { value: "One link", label: "Clients book without the back-and-forth." },
  { value: "Paid first", label: "Appointments appear only after Stripe confirms." },
  { value: "On time", label: "Reminders land in your timezone, not theirs." },
];

const features = [
  {
    title: "A page they actually finish",
    body: "One link. Service, time in your timezone, pay with Stripe. No chasing texts.",
  },
  {
    title: "Your hours, your time off",
    body: "Weekly availability plus blocked ranges. Taken slots vanish on their own.",
  },
  {
    title: "Paid before it hits the calendar",
    body: "Full price or a deposit. Appointments appear only after Stripe confirms.",
  },
  {
    title: "Reminders that land on time",
    body: "Email and SMS around 24 hours and 1 hour before, in your timezone.",
  },
  {
    title: "Clients, history, private notes",
    body: "Every booking writes a client record you can actually run a studio from.",
  },
  {
    title: "A week you can work from",
    body: "Today and the rest of the week. Completed, cancelled, or no-show in one tap.",
  },
];

const steps = [
  {
    n: "01",
    title: "Create your account",
    body: "Name, business, timezone, hours.",
  },
  {
    n: "02",
    title: "List what you sell",
    body: "Duration, price, optional deposit.",
  },
  {
    n: "03",
    title: "Share the link",
    body: "They pick a slot, pay, and you are booked.",
  },
];

const quotes = [
  {
    quote:
      "I stopped negotiating times over WhatsApp. The calendar fills itself and the deposit is already there.",
    name: "Maya Chen",
    role: "Nail studio, Brooklyn",
    src: "/marketing/portrait-nails.png",
  },
  {
    quote:
      "Clients show up knowing the price. Reminders cut my no-shows without me sending a single extra message.",
    name: "Luis Ortega",
    role: "Mobile trainer, Austin",
    src: "/marketing/portrait-trainer.png",
  },
];

const faqs = [
  {
    q: "Do I need a credit card to start?",
    a: "No. Create an account, finish setup, and share your booking page. Stripe keys are only needed when you take payments.",
  },
  {
    q: "Is there a contract?",
    a: "Plans are month to month. You can stay on the free start until you are ready to subscribe.",
  },
  {
    q: "What timezone are times shown in?",
    a: "Always yours — labeled so clients are not looking at their device clock.",
  },
  {
    q: "When is an appointment created?",
    a: "Only after Stripe confirms payment. Abandoned checkouts never occupy a slot.",
  },
  {
    q: "Can I take deposits?",
    a: "Yes. Set a deposit on a service and Checkout charges that amount instead of the full price.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-ink text-sand">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.55'/></svg>\")",
        }}
        aria-hidden
      />
      <HomeAtmosphere />

      <div className="relative z-10">
        <SiteHeader />
        <main>
          <HomeHero />
          <IndustryMarquee />

          <section className="border-b border-line">
            <div className="mx-auto grid max-w-6xl gap-8 px-page py-12 sm:py-14 md:grid-cols-3">
              {stats.map((stat, index) => (
                <Reveal key={stat.value} delayMs={index * 90}>
                  <p className="font-mono text-xs tracking-[0.16em] text-moss-light uppercase sm:text-sm sm:tracking-[0.2em]">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-base text-mist sm:text-lg">{stat.label}</p>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-page py-16 sm:py-20 lg:py-24">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.28em] text-moss-light">
                The product
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Quiet software. Loud calendar.
              </h2>
              <p className="mt-4 max-w-2xl text-base text-mist sm:text-lg">
                ServiceBooker is the loop from public booking to paid
                appointment to reminder — without a field-service suite you will
                never open.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-12">
              <Reveal className="relative min-h-[18rem] overflow-hidden rounded-[1.5rem] border border-line sm:col-span-2 sm:min-h-[22rem] sm:rounded-[1.75rem] lg:col-span-7 lg:row-span-2 lg:min-h-[32rem]">
                <Image
                  src="/marketing/feature-phone.png"
                  alt="Phone on a salon counter showing a booking calendar"
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                <p className="absolute bottom-5 left-5 right-5 text-lg font-medium sm:bottom-6 sm:left-6 sm:right-6 sm:text-xl">
                  They book from the couch. You see it on the board.
                </p>
              </Reveal>
              {features.slice(0, 2).map((feature, index) => (
                <Reveal
                  key={feature.title}
                  delayMs={index * 80}
                  className="lg:col-span-5"
                >
                  <article className="h-full rounded-[1.5rem] border border-line bg-panel/80 p-5 sm:p-6 transition duration-300 hover:-translate-y-1 hover:border-moss">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className={`mt-2 ${mutedClass}`}>{feature.body}</p>
                  </article>
                </Reveal>
              ))}
              {features.slice(2).map((feature, index) => (
                <Reveal
                  key={feature.title}
                  delayMs={index * 70}
                  className="lg:col-span-3"
                >
                  <article className="h-full rounded-[1.5rem] border border-line bg-panel/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-moss">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className={`mt-2 ${mutedClass}`}>{feature.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="border-y border-line bg-panel/30 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto grid max-w-6xl items-start gap-10 px-page lg:grid-cols-2 lg:gap-12">
              <Reveal>
                <p className="text-xs uppercase tracking-[0.28em] text-moss-light">
                  How it feels
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  A page they finish in under a minute.
                </h2>
                <p className="mt-4 text-base text-mist sm:text-lg">
                  Service, day, time, pay. The slot is held only after Stripe
                  confirms — so your week never fills with ghosts.
                </p>
              </Reveal>
              <Reveal delayMs={120} className="min-w-0">
                <BookingPreview />
              </Reveal>
            </div>
          </section>

          <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
            <div className="absolute inset-0">
              <Image
                src="/marketing/waiting-book.png"
                alt=""
                fill
                className="object-cover opacity-45"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-ink/60" />
            </div>
            <div className="relative mx-auto max-w-6xl px-page">
              <Reveal>
                <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  Live in three beats.
                </h2>
              </Reveal>
              <ol className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
                {steps.map((step, index) => (
                  <Reveal key={step.n} delayMs={index * 120}>
                    <li className="relative overflow-hidden rounded-[1.5rem] border border-line bg-ink/80 p-5 sm:p-6 backdrop-blur">
                      <p className="font-mono text-4xl text-moss/45 sm:text-5xl">
                        {step.n}
                      </p>
                      <h3 className="mt-6 text-xl font-semibold sm:mt-8">
                        {step.title}
                      </h3>
                      <p className={`mt-2 ${mutedClass}`}>{step.body}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-page py-16 sm:py-20 lg:py-24">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.28em] text-moss-light">
                Operators
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Built around the week, not the dashboard.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-2">
              {quotes.map((item, index) => (
                <Reveal key={item.name} delayMs={index * 120}>
                  <figure className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-panel sm:flex-row sm:rounded-[1.75rem]">
                    <div className="relative h-44 w-full shrink-0 sm:h-auto sm:w-40">
                      <Image
                        src={item.src}
                        alt=""
                        fill
                        className="object-cover object-top"
                        sizes="(min-width: 640px) 160px, 100vw"
                      />
                    </div>
                    <div className="p-5 sm:p-6 md:p-8">
                      <blockquote className="text-base leading-relaxed text-sand sm:text-lg">
                        “{item.quote}”
                      </blockquote>
                      <figcaption className={`mt-5 ${mutedClass}`}>
                        {item.name} · {item.role}
                      </figcaption>
                    </div>
                  </figure>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-6 overflow-hidden rounded-[1.5rem] border border-line sm:rounded-[1.75rem]">
              <div className="grid sm:grid-cols-2">
                <div className="relative min-h-[14rem] sm:min-h-[16rem]">
                  <Image
                    src="/marketing/industry-clean.png"
                    alt="Cleaner wiping a stone kitchen island"
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="relative min-h-[14rem] sm:min-h-[16rem]">
                  <Image
                    src="/marketing/still-tools.png"
                    alt="Salon tools on a dark marble counter"
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
              </div>
            </Reveal>
          </section>

          <section id="pricing" className="mx-auto max-w-6xl px-page py-16 sm:py-20 lg:py-24">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Simple pricing for every business size
              </h2>
              <p className="mt-3 max-w-2xl text-mist">
                Start free. Every plan is month to month.
              </p>
            </Reveal>
            <div className="mt-10 sm:mt-12">
              <PricingGrid />
            </div>
          </section>

          <section className="border-y border-line bg-panel/30 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-3xl px-page">
              <Reveal>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Questions, answered
                </h2>
              </Reveal>
              <div className="mt-8 divide-y divide-line border-y border-line">
                {faqs.map((item) => (
                  <details key={item.q} className="group py-4 sm:py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-medium transition-colors hover:text-moss-light sm:items-center">
                      <span>{item.q}</span>
                      <span className="shrink-0 text-moss-light transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className={`mt-2 ${mutedClass}`}>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="relative mx-4 my-10 min-h-[22rem] overflow-hidden rounded-[1.5rem] border border-line sm:mx-6 sm:my-16 sm:min-h-[28rem] sm:rounded-[2rem] md:mx-auto md:max-w-6xl">
            <Image
              src="/marketing/cta-salon.png"
              alt=""
              fill
              className="object-cover animate-ken"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-ink/70" />
            <div className="relative flex min-h-[22rem] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[28rem] sm:px-8 sm:py-24">
              <Reveal>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  Open the books this week.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base text-mist sm:text-lg">
                  Add a service. Send the link. Let the week fill without another
                  round of messages.
                </p>
                <Link
                  href="/signup"
                  className={`${primaryCtaClass} cta-shine mt-8 w-full sm:w-auto`}
                >
                  Create your booking page
                </Link>
              </Reveal>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
