export function greetingForHour(hour: number) {
  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

export function formatHourMinutes(totalMins: number) {
  const hours = Math.floor(Math.max(0, totalMins) / 60);
  const mins = Math.max(0, totalMins) % 60;
  return `${hours}h ${mins}m`;
}

const TRIAL_DAYS = 14;

export function trialDaysLeft(createdAt: Date, now = new Date()) {
  const end = createdAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((end - now.getTime()) / (24 * 60 * 60 * 1000)));
}
