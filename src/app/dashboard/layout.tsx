import { requireProvider } from "@/lib/session";

import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({
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
