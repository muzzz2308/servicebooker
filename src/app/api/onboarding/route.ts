import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidTime, toMinutes } from "@/lib/schedule";
import { isValidSlug } from "@/lib/slug";

type IncomingDay = {
  dayOfWeek: number;
  isOpen: boolean;
  startTime: string;
  endTime: string;
};

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

function parseDays(value: unknown): IncomingDay[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const days: IncomingDay[] = [];
  const seen = new Set<number>();

  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) {
      return null;
    }

    const { dayOfWeek, isOpen, startTime, endTime } = entry as Record<
      string,
      unknown
    >;

    if (
      typeof dayOfWeek !== "number" ||
      !Number.isInteger(dayOfWeek) ||
      dayOfWeek < 0 ||
      dayOfWeek > 6 ||
      seen.has(dayOfWeek) ||
      typeof isOpen !== "boolean" ||
      typeof startTime !== "string" ||
      typeof endTime !== "string"
    ) {
      return null;
    }

    seen.add(dayOfWeek);
    days.push({ dayOfWeek, isOpen, startTime, endTime });
  }

  return days;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { timezone, slug, days } = (body ?? {}) as Record<string, unknown>;

  if (typeof timezone !== "string" || typeof slug !== "string") {
    return NextResponse.json(
      { error: "Timezone and booking URL are required." },
      { status: 400 },
    );
  }

  if (!Intl.supportedValuesOf("timeZone").includes(timezone)) {
    return NextResponse.json({ error: "Unknown timezone." }, { status: 400 });
  }

  const normalizedSlug = slug.trim();

  if (!isValidSlug(normalizedSlug)) {
    return NextResponse.json(
      { error: "Use 3-60 characters: lowercase letters, numbers and hyphens." },
      { status: 400 },
    );
  }

  const parsedDays = parseDays(days);

  if (!parsedDays) {
    return NextResponse.json({ error: "Invalid working hours." }, { status: 400 });
  }

  const openDays = parsedDays.filter((day) => day.isOpen);

  for (const day of openDays) {
    if (!isValidTime(day.startTime) || !isValidTime(day.endTime)) {
      return NextResponse.json(
        { error: "Working hours must use 24-hour HH:MM times." },
        { status: 400 },
      );
    }

    if (toMinutes(day.startTime) >= toMinutes(day.endTime)) {
      return NextResponse.json(
        { error: "Each day's start time must be before its end time." },
        { status: 400 },
      );
    }
  }

  const providerId = session.user.id;

  try {
    // Replace the whole week so re-running onboarding stays idempotent.
    await prisma.$transaction(
      [
        prisma.provider.update({
          where: { id: providerId },
          data: { timezone, slug: normalizedSlug },
        }),
        prisma.availability.deleteMany({ where: { providerId } }),
        prisma.availability.createMany({
          data: openDays.map((day) => ({
            providerId,
            dayOfWeek: day.dayOfWeek,
            startTime: day.startTime,
            endTime: day.endTime,
          })),
        }),
      ],
      // Round trips to a hosted database can exceed the 2s default maxWait.
      { maxWait: 15_000, timeout: 20_000 },
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: "That URL is already taken." },
        { status: 409 },
      );
    }

    throw error;
  }

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");

  return NextResponse.json({ ok: true });
}
