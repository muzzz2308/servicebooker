export function formatTimezoneLabel(timezone: string) {
  return (timezone || "UTC").replace(/_/g, " ");
}

/** Shown next to any list of times so they are not mistaken for device-local. */
export function timesInProviderZone(timezone: string) {
  return `Times in ${formatTimezoneLabel(timezone)} (provider timezone, not your device).`;
}
