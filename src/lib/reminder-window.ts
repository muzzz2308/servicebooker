const HOUR_MS = 60 * 60 * 1000;
const WINDOW_HALF_HOURS = 0.5;

/** Appointments whose start falls in `[centerHours ± 30 minutes]` from `now`. */
export function reminderWindow(now: Date, centerHours: number) {
  const pad = WINDOW_HALF_HOURS * HOUR_MS;
  const center = centerHours * HOUR_MS;

  return {
    gte: new Date(now.getTime() + center - pad),
    lte: new Date(now.getTime() + center + pad),
  };
}
