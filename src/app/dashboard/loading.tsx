export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden>
      <div className="h-10 rounded-lg bg-panel" />
      <div className="h-10 w-72 rounded-md bg-panel" />
      <div className="h-72 rounded-2xl border border-line bg-panel" />
      <div className="h-56 rounded-2xl border border-line bg-panel" />
      <div className="h-24 rounded-2xl border border-line bg-panel" />
    </div>
  );
}
