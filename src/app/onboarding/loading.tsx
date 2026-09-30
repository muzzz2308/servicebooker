export default function OnboardingLoading() {
  return (
    <div className="mx-auto max-w-lg animate-pulse" aria-hidden>
      <div className="h-8 w-56 rounded-md bg-panel" />
      <div className="mt-4 h-4 w-full rounded-md bg-panel/80" />
      <div className="mt-8 h-64 rounded-2xl border border-line bg-panel" />
    </div>
  );
}
