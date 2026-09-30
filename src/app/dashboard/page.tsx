import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";

import { NewButton } from "@/components/dashboard/new-button";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SetupChecklist, type SetupStep } from "@/components/dashboard/setup-checklist";
import { mutedClass } from "@/components/ui";
import {
  firstName,
  formatHourMinutes,
  greetingForHour,
  trialDaysLeft,
} from "@/lib/dashboard-home";
import { formatCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import {
  buildRevenueSeries,
  daysInRange,
  revenueWindow,
} from "@/lib/revenue";
import { providerScheduleWindow } from "@/lib/schedule-window";
import { requireProvider } from "@/lib/session";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const provider = await requireProvider();
  const now = new Date();
  const { todayStart } = providerScheduleWindow(now, provider.timezone);
  const paidWindow = revenueWindow(now, provider.timezone, 365);
  const hour = Number(formatInTimeZone(now, provider.timezone, "H"));
  const daysLeft = trialDaysLeft(provider.createdAt, now);

  const [serviceCount, hoursCount, paid] = await Promise.all([
    prisma.service.count({ where: { providerId: provider.id } }),
    prisma.availability.count({ where: { providerId: provider.id } }),
    prisma.appointment.findMany({
      where: {
        providerId: provider.id,
        status: { in: ["confirmed", "completed"] },
        startsAt: { gte: paidWindow.rangeStart, lt: paidWindow.rangeEnd },
      },
      select: {
        startsAt: true,
        amountPaidCents: true,
        service: { select: { durationMins: true } },
      },
    }),
  ]);

  const today = paid.filter((row) => row.startsAt >= todayStart);
  const revenuePoints = buildRevenueSeries(
    paid,
    provider.timezone,
    daysInRange(paidWindow.startDay, paidWindow.today),
  );

  const hasHours = hoursCount > 0;
  const hasServices = serviceCount > 0;
  const bookingHref = `/book/${provider.slug}`;

  const steps: SetupStep[] = [
    {
      href: "/dashboard/services",
      title: "Create your services",
      body: "Add what you offer, with duration, price, and an optional deposit.",
      done: hasServices,
    },
    {
      href: "/onboarding",
      title: "Set your timezone and booking URL",
      body: "Clients see times in your zone. Pick the public /book link they will use.",
      done: hasHours,
    },
    {
      href: "/onboarding",
      title: "Set your business hours",
      body: "Weekly hours so clients can only pick times you actually work.",
      done: hasHours,
    },
    {
      href: bookingHref,
      title: "Preview your booking page",
      body: "See the page clients finish — service, time, then Stripe.",
      done: hasServices && hasHours,
    },
    {
      href: bookingHref,
      title: "Share your booking link",
      body: "Send /book/" + provider.slug + " when a client asks for a time.",
      done: hasServices && hasHours,
    },
  ];

  const todayMins = today.reduce(
    (sum, row) => sum + row.service.durationMins,
    0,
  );
  const todayCents = today.reduce((sum, row) => sum + row.amountPaidCents, 0);

  return (
    <div className="space-y-6">
      {daysLeft > 0 ? (
        <p className="rounded-lg border border-moss/40 bg-moss/15 px-4 py-2.5 text-sm font-medium text-sand">
          {daysLeft} {daysLeft === 1 ? "day" : "days"} left in free trial
        </p>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {greetingForHour(hour)}, {firstName(provider.name)}.
          </h1>
          <p className={`mt-1 ${mutedClass}`}>
            Here&apos;s how {provider.businessName} is doing today.
          </p>
        </div>
        <NewButton bookingHref={bookingHref} />
      </div>

      <SetupChecklist steps={steps} />

      <RevenueChart points={revenuePoints} />

      <section className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 sm:px-6">
          <h2 className="text-sm font-semibold">Today</h2>
          <Link
            href="/dashboard/schedule"
            className="text-sm text-moss-light hover:underline"
          >
            Open schedule
          </Link>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-line">
          <div className="px-5 py-4 sm:px-6">
            <dt className="text-xs uppercase tracking-wide text-mist">
              Appointments
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              {today.length}
            </dd>
          </div>
          <div className="px-5 py-4 sm:px-6">
            <dt className="text-xs uppercase tracking-wide text-mist">Time</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              {formatHourMinutes(todayMins)}
            </dd>
          </div>
          <div className="px-5 py-4 sm:px-6">
            <dt className="text-xs uppercase tracking-wide text-mist">Paid</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              {formatCents(todayCents)}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
