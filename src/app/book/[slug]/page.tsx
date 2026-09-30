import { notFound } from "next/navigation";
import { cache } from "react";

import { cardClass, mutedClass } from "@/components/ui";
import { listBookableDates } from "@/lib/booking";
import { prisma } from "@/lib/prisma";
import { timesInProviderZone } from "@/lib/timezone";

import { BookingForm } from "./booking-form";

export const dynamic = "force-dynamic";

type Params = { slug: string };

const getBookableProvider = cache(async (slug: string) => {
  return prisma.provider.findUnique({
    where: { slug },
    select: {
      slug: true,
      businessName: true,
      timezone: true,
      services: {
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          durationMins: true,
          priceCents: true,
          depositCents: true,
        },
      },
    },
  });
});

export async function generateMetadata({ params }: { params: Params }) {
  const provider = await getBookableProvider(params.slug);

  return {
    title: provider ? `Book with ${provider.businessName}` : "Not found",
  };
}

export default async function BookPage({ params }: { params: Params }) {
  const provider = await getBookableProvider(params.slug);

  if (!provider) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-6 py-12">
      <div className={cardClass}>
        <p className={mutedClass}>Book an appointment</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {provider.businessName}
        </h1>
        <p className={`mt-2 ${mutedClass}`}>
          {timesInProviderZone(provider.timezone)}
        </p>

        <BookingForm
          slug={provider.slug}
          timezone={provider.timezone}
          dates={listBookableDates(provider.timezone)}
          services={provider.services}
        />
      </div>
    </main>
  );
}
