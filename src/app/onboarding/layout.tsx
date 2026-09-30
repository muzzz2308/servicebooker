import { requireProvider } from "@/lib/session";

import { DashboardShell } from "@/components/dashboard/shell";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const provider = await requireProvider();

  return (
    <DashboardShell
      provider={{
        name: provider.name,
        businessName: provider.businessName,
        slug: provider.slug,
      }}
    >
      {children}
    </DashboardShell>
  );
}
