import { cache } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const currentProviderId = cache(async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
});

/**
 * Loads the signed-in Provider, redirecting to /login when there is no usable
 * session. Use this in server components and route handlers that require auth.
 * Cached per request so layout + page share one lookup.
 */
export const requireProvider = cache(async () => {
  const id = await currentProviderId();

  if (!id) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: { id },
  });

  // The token can outlive the row it points at.
  if (!provider) {
    redirect("/login");
  }

  return provider;
});
