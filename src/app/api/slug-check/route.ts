import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidSlug } from "@/lib/slug";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const slug = new URL(request.url).searchParams.get("slug")?.trim() ?? "";

  if (!isValidSlug(slug)) {
    return NextResponse.json({
      available: false,
      error: "Use 3-60 characters: lowercase letters, numbers and hyphens.",
    });
  }

  const owner = await prisma.provider.findUnique({
    where: { slug },
    select: { id: true },
  });

  // Keeping your own slug counts as available.
  const available = !owner || owner.id === session.user.id;

  return NextResponse.json({
    available,
    error: available ? undefined : "That URL is already taken.",
  });
}
