import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { isIndustry } from "@/lib/industries";
import { BCRYPT_ROUNDS, MIN_PASSWORD_LENGTH } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { defaultWorkingDays } from "@/lib/schedule";
import { slugify } from "@/lib/slug";

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

/** Derives a slug from the business name, adding a suffix until it is free. */
async function findAvailableSlug(businessName: string) {
  const base = slugify(businessName) || "provider";
  const existing = await prisma.provider.findMany({
    where: { slug: { startsWith: base } },
    select: { slug: true },
  });
  const taken = new Set(existing.map((row) => row.slug));

  if (!taken.has(base)) {
    return base;
  }

  for (let attempt = 2; attempt < 26; attempt += 1) {
    const candidate = `${base}-${attempt}`;
    if (!taken.has(candidate)) {
      return candidate;
    }
  }

  return `${base}-${Date.now().toString(36)}`;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    email,
    password,
    name,
    businessName,
    location,
    industry,
    timezone: timezoneInput,
  } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string" ||
    typeof businessName !== "string"
  ) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();
  const trimmedBusinessName = businessName.trim();
  const trimmedLocation =
    typeof location === "string" ? location.trim() : "";
  const industryValue = typeof industry === "string" ? industry.trim() : "";
  const timezoneValue =
    typeof timezoneInput === "string" ? timezoneInput.trim() : "America/New_York";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 },
    );
  }

  if (!trimmedName || !trimmedBusinessName) {
    return NextResponse.json(
      { error: "Name and business name are required." },
      { status: 400 },
    );
  }

  if (trimmedLocation.length < 2 || trimmedLocation.length > 120) {
    return NextResponse.json(
      { error: "Enter a city or neighborhood." },
      { status: 400 },
    );
  }

  if (!isIndustry(industryValue)) {
    return NextResponse.json({ error: "Select an industry." }, { status: 400 });
  }

  const timezone =
    Intl.supportedValuesOf("timeZone").includes(timezoneValue)
      ? timezoneValue
      : "America/New_York";

  const existing = await prisma.provider.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    const provider = await prisma.provider.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: trimmedName,
        businessName: trimmedBusinessName,
        slug: await findAvailableSlug(trimmedBusinessName),
        location: trimmedLocation,
        industry: industryValue,
        timezone,
        availability: {
          create: defaultWorkingDays()
            .filter((day) => day.isOpen)
            .map((day) => ({
              dayOfWeek: day.dayOfWeek,
              startTime: day.startTime,
              endTime: day.endTime,
            })),
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ id: provider.id }, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }

    throw error;
  }
}
