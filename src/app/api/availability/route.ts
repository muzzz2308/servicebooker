import { NextResponse } from "next/server";

import { getAvailableSlots } from "@/lib/availability";
import {
  instantOnProviderDate,
  isIsoDate,
  listBookableDates,
} from "@/lib/booking";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const slug = params.get("slug")?.trim() ?? "";
  const serviceId = params.get("serviceId")?.trim() ?? "";
  const date = params.get("date")?.trim() ?? "";

  if (!slug || !serviceId || !isIsoDate(date)) {
    return NextResponse.json(
      { error: "slug, serviceId, and date (YYYY-MM-DD) are required." },
      { status: 400 },
    );
  }

  const provider = await prisma.provider.findUnique({
    where: { slug },
    select: { id: true, timezone: true },
  });

  if (!provider) {
    return NextResponse.json({ error: "Provider not found." }, { status: 404 });
  }

  if (!listBookableDates(provider.timezone).includes(date)) {
    return NextResponse.json(
      { error: "Date is outside the booking window." },
      { status: 400 },
    );
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId, providerId: provider.id, isActive: true },
    select: { id: true, durationMins: true },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }

  const slots = await getAvailableSlots(
    provider.id,
    service.id,
    instantOnProviderDate(date, provider.timezone),
    { timezone: provider.timezone, durationMins: service.durationMins },
  );

  return NextResponse.json({ slots, timezone: provider.timezone });
}
