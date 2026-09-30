export function BookingPreview() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const slots = ["9:00", "9:45", "11:30", "1:15", "3:00"];

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-line bg-panel shadow-[0_40px_80px_-40px_rgba(0,0,0,0.85)] sm:rounded-[1.75rem]">
      <div className="flex flex-col gap-3 border-b border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Maya Chen Studio</p>
          <p className="text-xs text-mist">Haircut · 45 min · $65</p>
        </div>
        <span className="w-fit max-w-full truncate rounded-full border border-moss/40 bg-moss/15 px-2.5 py-1 text-[11px] text-moss-light">
          America/New_York
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 px-4 py-4 sm:gap-2 sm:px-5">
        {days.map((day, index) => (
          <div
            key={day}
            className={`rounded-xl px-1 py-2.5 text-center text-[10px] sm:px-2 sm:py-3 sm:text-xs ${
              index === 2
                ? "bg-moss text-ink"
                : "border border-line text-mist"
            }`}
          >
            <p className="font-medium">{day}</p>
            <p className="mt-1 text-[10px] sm:text-[11px]">{12 + index}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 px-4 pb-5 sm:px-5">
        {slots.map((slot, index) => (
          <div
            key={slot}
            className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm sm:px-4 ${
              index === 2
                ? "bg-moss text-ink"
                : "border border-line bg-ink/60"
            }`}
          >
            <span>{slot}</span>
            <span className={index === 2 ? "font-medium" : "text-mist"}>
              {index === 2 ? "Selected" : "Open"}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-line bg-ink/70 px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-mist">Due now</span>
          <span className="font-semibold">$65.00</span>
        </div>
        <div className="mt-3 h-10 rounded-md bg-moss text-center text-sm font-medium leading-10 text-ink">
          Continue to Stripe
        </div>
      </div>
    </div>
  );
}
