"use server";

import { revalidatePath } from "next/cache";
import { fromZonedTime } from "date-fns-tz";

import { prisma } from "@/lib/prisma";
import { isIsoDate } from "@/lib/booking";
import { isUpdatableStatus } from "@/lib/schedule-window";
import { isValidTime } from "@/lib/schedule";
import { currentProviderId } from "@/lib/session";

export type DashboardActionResult = { ok: true } | { ok: false; error: string };

export async function updateAppointmentStatus(
  appointmentId: string,
  status: string,
): Promise<DashboardActionResult> {
  const providerId = await currentProviderId();

  if (!providerId) {
    return { ok: false, error: "You must be logged in." };
  }

  if (typeof appointmentId !== "string" || !appointmentId) {
    return { ok: false, error: "Appointment not found." };
  }

  if (!isUpdatableStatus(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const { count } = await prisma.appointment.updateMany({
    where: { id: appointmentId, providerId },
    data: { status },
  });

  if (count === 0) {
    return { ok: false, error: "Appointment not found." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/schedule");
  revalidatePath("/dashboard/clients");

  return { ok: true };
}

export async function createTimeOff(input: {
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}): Promise<DashboardActionResult> {
  const providerId = await currentProviderId();

  if (!providerId) {
    return { ok: false, error: "You must be logged in." };
  }

  const date = input.date?.trim() ?? "";
  const startTime = (input.startTime?.trim() ?? "").slice(0, 5);
  const endTime = (input.endTime?.trim() ?? "").slice(0, 5);
  const reason = input.reason?.trim() || null;

  if (!isIsoDate(date) || !isValidTime(startTime) || !isValidTime(endTime)) {
    return { ok: false, error: "Pick a date and start/end times." };
  }

  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
    select: { timezone: true },
  });

  if (!provider) {
    return { ok: false, error: "You must be logged in." };
  }

  const startsAt = fromZonedTime(`${date}T${startTime}:00`, provider.timezone);
  const endsAt = fromZonedTime(`${date}T${endTime}:00`, provider.timezone);

  if (endsAt.getTime() <= startsAt.getTime()) {
    return { ok: false, error: "End time must be after start time." };
  }

  if (reason && reason.length > 200) {
    return { ok: false, error: "Reason must be 200 characters or less." };
  }

  await prisma.timeOff.create({
    data: {
      providerId,
      startsAt,
      endsAt,
      reason,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/schedule");

  return { ok: true };
}
