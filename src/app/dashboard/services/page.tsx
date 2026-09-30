import Link from "next/link";

import { cardClass, mutedClass } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { requireProvider } from "@/lib/session";

import { AddService } from "./add-service";
import { ServiceRow } from "./service-row";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const provider = await requireProvider();
  const services = await prisma.service.findMany({
    where: { providerId: provider.id },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      durationMins: true,
      priceCents: true,
      depositCents: true,
      isActive: true,
    },
  });

  return (
    <div className={cardClass}>
      <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
      <p className={`mt-1 ${mutedClass}`}>
        What clients can book, how long it takes and what it costs.
      </p>

      <div className="mt-6">
        <AddService />
      </div>

      {services.length === 0 ? (
        <div className="mt-6 space-y-3">
          <p className={mutedClass}>
            No services yet. Add your first one above so clients have something
            to book.
          </p>
          <Link href={`/book/${provider.slug}`} className="text-sm text-moss-light underline">
            Preview your booking page
          </Link>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line">
          {services.map((service) => (
            <ServiceRow key={service.id} service={service} />
          ))}
        </ul>
      )}
    </div>
  );
}
