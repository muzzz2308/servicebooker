import { cardClass, mutedClass } from "@/components/ui";

export default function BookLoading() {
  return (
    <main className="mx-auto max-w-2xl p-6 py-12">
      <div className={cardClass}>
        <p className={mutedClass}>Loading booking page...</p>
      </div>
    </main>
  );
}
