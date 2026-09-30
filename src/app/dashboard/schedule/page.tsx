import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";

import { cardClass, mutedClass } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { providerScheduleWindow } from "@/lib/schedule-window";
import { requireProvider } from "@/lib/session";
import { resolveProviderDay } from "@/lib/slots";
import { timesInProviderZone } from "@/lib/timezone";

import { AppointmentStatusButtons } from "../appointment-status-buttons";
import { BlockTimeForm } from "../block-time-form";

export const metadata = { title: "Schedule" };

type UpcomingAppointment = {
  id: string;
  startsAt: Date;
  client: { name: string };
  service: { name: string };
};

export default async function SchedulePage() {
  const provider = await requireProvider();
  const now = new Date();
  const { todayEnd, weekEnd } = providerScheduleWindow(now, provider.timezone);

  const upcoming = await prisma.appointment.findMany({
    where: {
      providerId: provider.id,
      status: "confirmed",
      startsAt: { gte: now, lt: weekEnd },
    },
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      startsAt: true,
      client: { select: { name: true } },
      service: { select: { name: true } },
    },
  });

  const today = upcoming.filter((row) => row.startsAt < todayEnd);
  const restOfWeek = upcoming.filter((row) => row.startsAt >= todayEnd);

  return (
    <div className="space-y-6">
      <div className={`${cardClass} space-y-4`}>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Schedule</h1>
          <p className={`mt-1 ${mutedClass}`}>
            {timesInProviderZone(provider.timezone)}
          </p>
        </div>

        <BlockTimeForm
          defaultDate={resolveProviderDay(now, provider.timezone).dayStr}
          timezone={provider.timezone}
        />
      </div>

      {upcoming.length === 0 ? (
        <section className={cardClass}>
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            No appointments yet
          </h2>
          <p className={`mt-3 ${mutedClass}`}>
            Share your booking page so clients can schedule with you, or add a
            service if you haven&apos;t already.
          </p>
          <p className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link
              href={`/book/${provider.slug}`}
              className="text-moss-light hover:underline"
            >
              Open booking page
            </Link>
            <Link
              href="/dashboard/services"
              className="text-moss-light hover:underline"
            >
              Add a service
            </Link>
          </p>
        </section>
      ) : (
        <>
          <AppointmentSection
            title="Today"
            empty="No more appointments today."
            timezone={provider.timezone}
            appointments={today}
            timeFormat="h:mm a"
          />

          <AppointmentSection
            title="This week"
            empty="Nothing else on the calendar this week."
            timezone={provider.timezone}
            appointments={restOfWeek}
            timeFormat="EEE h:mm a"
          />
        </>
      )}
    </div>
  );
}

function AppointmentSection({
  title,
  empty,
  timezone,
  appointments,
  timeFormat,
}: {
  title: string;
  empty: string;
  timezone: string;
  appointments: UpcomingAppointment[];
  timeFormat: string;
}) {
  return (
    <section className={cardClass}>
      <h2 className="text-sm font-semibold uppercase tracking-wide">{title}</h2>
      {appointments.length === 0 ? (
        <p className={`mt-3 ${mutedClass}`}>{empty}</p>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <div>
                <p className="font-medium">{appointment.client.name}</p>
                <p className={mutedClass}>
                  {appointment.service.name} &middot;{" "}
                  {formatInTimeZone(appointment.startsAt, timezone, timeFormat)}
                </p>
              </div>
              <AppointmentStatusButtons appointmentId={appointment.id} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
