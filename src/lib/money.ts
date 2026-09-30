/**
 * Parses a dollar amount like "75", "75.5" or "75.50" into integer cents.
 * Returns null for anything that isn't a non-negative amount with at most two
 * decimal places. String math keeps us clear of float rounding surprises.
 */
export function parseDollarsToCents(value: string): number | null {
  const trimmed = value.trim().replace(/^\$/, "");

  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null;
  }

  const [whole, fraction = ""] = trimmed.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));

  return Number.isSafeInteger(cents) ? cents : null;
}

/** 7550 -> "75.50" */
export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** 7550 -> "$75.50" */
export function formatCents(cents: number): string {
  return `$${centsToDollars(cents)}`;
}
