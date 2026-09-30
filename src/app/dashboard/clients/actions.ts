"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { currentProviderId } from "@/lib/session";

export type ClientActionResult = { ok: true } | { ok: false; error: string };

const NOTES_MAX = 2000;

export async function updateClientNotes(
  clientId: string,
  notes: string,
): Promise<ClientActionResult> {
  const providerId = await currentProviderId();

  if (!providerId) {
    return { ok: false, error: "You must be logged in." };
  }

  if (typeof clientId !== "string" || !clientId) {
    return { ok: false, error: "Client not found." };
  }

  const trimmed = notes.trim();

  if (trimmed.length > NOTES_MAX) {
    return { ok: false, error: `Notes must be ${NOTES_MAX} characters or less.` };
  }

  const { count } = await prisma.client.updateMany({
    where: { id: clientId, providerId },
    data: { notes: trimmed.length > 0 ? trimmed : null },
  });

  if (count === 0) {
    return { ok: false, error: "Client not found." };
  }

  revalidatePath("/dashboard/clients");

  return { ok: true };
}
