import { cardClass, mutedClass } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { defaultWorkingDays, type WorkingDay } from "@/lib/schedule";
import { requireProvider } from "@/lib/session";

import { OnboardingForm } from "./onboarding-form";

export const metadata = { title: "Set up your business" };

export default async function OnboardingPage() {
  const provider = await requireProvider();
  const availability = await prisma.availability.findMany({
    where: { providerId: provider.id },
  });

  // Prefill from saved availability so onboarding can be revisited.
  const days: WorkingDay[] = defaultWorkingDays().map((day) => {
    const saved = availability.find((row) => row.dayOfWeek === day.dayOfWeek);

    if (!saved) {
      return availability.length > 0 ? { ...day, isOpen: false } : day;
    }

    return {
      dayOfWeek: day.dayOfWeek,
      isOpen: true,
      startTime: saved.startTime,
      endTime: saved.endTime,
    };
  });

  return (
    <main className="mx-auto max-w-2xl">
      <div className={cardClass}>
        <h1 className="text-2xl font-semibold tracking-tight">
          Set up your business
        </h1>
        <p className={`mt-1 ${mutedClass}`}>
          A few details and {provider.businessName} is ready to take bookings.
        </p>

        <OnboardingForm
          businessName={provider.businessName}
          initialTimezone={provider.timezone}
          initialSlug={provider.slug}
          initialDays={days}
          timezones={Intl.supportedValuesOf("timeZone")}
        />
      </div>
    </main>
  );
}
