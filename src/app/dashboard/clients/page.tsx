import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";

import { cardClass, mutedClass } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { requireProvider } from "@/lib/session";
import { formatTimezoneLabel, timesInProviderZone } from "@/lib/timezone";

import { ClientNotes } from "./client-notes";

export const metadata = { title: "Clients" };

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No-show",
};

export default async function ClientsPage() {
  const provider = await requireProvider();
  const clients = await prisma.client.findMany({
    where: { providerId: provider.id },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      notes: true,
      appointments: {
        where: { providerId: provider.id },
        orderBy: { startsAt: "desc" },
        take: 8,
        select: {
          id: true,
          startsAt: true,
          status: true,
          service: { select: { name: true } },
        },
      },
    },
  });

  return (
    <div className={cardClass}>
      <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
      <p className={`mt-1 ${mutedClass}`}>
        People who have booked with you. {timesInProviderZone(provider.timezone)}
      </p>

      {clients.length === 0 ? (
        <div className="mt-6 space-y-3">
          <p className={mutedClass}>
            No clients yet. They&apos;ll appear here after someone books.
          </p>
          <Link href={`/book/${provider.slug}`} className="text-sm text-moss-light underline">
            Open your booking page
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-8">
          {clients.map((client) => (
            <li
              key={client.id}
              className="border-t border-line pt-6"
            >
              <p className="font-medium">{client.name}</p>
              <p className={mutedClass}>
                {client.email} &middot; {client.phone}
              </p>

              {client.appointments.length === 0 ? (
                <p className={`mt-3 ${mutedClass}`}>No appointments yet.</p>
              ) : (
                <ul className="mt-3 space-y-1 text-sm">
                  {client.appointments.map((appointment) => (
                    <li key={appointment.id}>
                      {formatInTimeZone(
                        appointment.startsAt,
                        provider.timezone,
                        "MMM d, yyyy 'at' h:mm a",
                      )}{" "}
                      ({formatTimezoneLabel(provider.timezone)}){" "}
                      &middot; {appointment.service.name} &middot;{" "}
                      {STATUS_LABEL[appointment.status] ?? appointment.status}
                    </li>
                  ))}
                </ul>
              )}

              <ClientNotes
                clientId={client.id}
                initialNotes={client.notes ?? ""}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
