"use server";

import { revalidatePath } from "next/cache";

import { parseDollarsToCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { currentProviderId } from "@/lib/session";

export type ServiceFormInput = {
  name: string;
  durationMins: string;
  price: string;
  deposit: string;
  isActive: boolean;
};

export type ServiceActionResult = { ok: true } | { ok: false; error: string };

const MAX_DURATION_MINS = 24 * 60;

type ValidatedService = {
  name: string;
  durationMins: number;
  priceCents: number;
  depositCents: number;
  isActive: boolean;
};

function hasPrismaCode(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === code
  );
}

function validate(
  input: ServiceFormInput,
): { data: ValidatedService } | { error: string } {
  const name = typeof input?.name === "string" ? input.name.trim() : "";

  if (name.length < 2 || name.length > 100) {
    return { error: "Name must be between 2 and 100 characters." };
  }

  const durationMins = Number(input.durationMins);

  if (
    !Number.isInteger(durationMins) ||
    durationMins < 1 ||
    durationMins > MAX_DURATION_MINS
  ) {
    return {
      error: `Duration must be a whole number of minutes between 1 and ${MAX_DURATION_MINS}.`,
    };
  }

  const priceCents = parseDollarsToCents(input.price ?? "");

  if (priceCents === null) {
    return { error: "Price must be a dollar amount such as 75 or 75.50." };
  }

  const depositCents = parseDollarsToCents(input.deposit ?? "");

  if (depositCents === null) {
    return { error: "Deposit must be a dollar amount such as 0 or 25.00." };
  }

  if (depositCents > priceCents) {
    return { error: "Deposit cannot be more than the price." };
  }

  return {
    data: {
      name,
      durationMins,
      priceCents,
      depositCents,
      isActive: Boolean(input.isActive),
    },
  };
}

export async function createService(
  input: ServiceFormInput,
): Promise<ServiceActionResult> {
  const providerId = await currentProviderId();

  if (!providerId) {
    return { ok: false, error: "You must be logged in." };
  }

  const validated = validate(input);

  if ("error" in validated) {
    return { ok: false, error: validated.error };
  }

  await prisma.service.create({ data: { providerId, ...validated.data } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/services");

  return { ok: true };
}

export async function updateService(
  id: string,
  input: ServiceFormInput,
): Promise<ServiceActionResult> {
  const providerId = await currentProviderId();

  if (!providerId) {
    return { ok: false, error: "You must be logged in." };
  }

  if (typeof id !== "string" || !id) {
    return { ok: false, error: "Service not found." };
  }

  const validated = validate(input);

  if ("error" in validated) {
    return { ok: false, error: validated.error };
  }

  // providerId in the filter is what stops one provider editing another's row.
  const { count } = await prisma.service.updateMany({
    where: { id, providerId },
    data: validated.data,
  });

  if (count === 0) {
    return { ok: false, error: "Service not found." };
  }

  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard");

  return { ok: true };
}

export async function deleteService(id: string): Promise<ServiceActionResult> {
  const providerId = await currentProviderId();

  if (!providerId) {
    return { ok: false, error: "You must be logged in." };
  }

  if (typeof id !== "string" || !id) {
    return { ok: false, error: "Service not found." };
  }

  try {
    const { count } = await prisma.service.deleteMany({
      where: { id, providerId },
    });

    if (count === 0) {
      return { ok: false, error: "Service not found." };
    }
  } catch (error) {
    // Appointment.serviceId is ON DELETE RESTRICT.
    if (hasPrismaCode(error, "P2003")) {
      return {
        ok: false,
        error:
          "This service is used by existing appointments. Mark it inactive instead.",
      };
    }

    throw error;
  }

  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard");

  return { ok: true };
}
