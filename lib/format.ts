/**
 * Formats "2026-12-13" as "13 December 2026". Anything that is not a full
 * ISO date (e.g. "2026" or "[date]") is shown exactly as written.
 */
export function formatDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Year used in citations: the first four digits of the date, if any. */
export function yearOf(value: string): string {
  const m = value.match(/\d{4}/);
  return m ? m[0] : "n.d.";
}

/** Joins names as "A", "A and B", "A, B and C". */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
