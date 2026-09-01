/**
 * "3 hours ago" from an ISO timestamp, recomputed against a caller-supplied `now`.
 *
 * `now` is a parameter rather than a `Date.now()` call inside so that every consumer on a
 * page reads the same instant, and so a component can re-render this on a ticking clock
 * without the function itself owning a timer.
 */
export const relativeTime = (iso: string, now: number): string => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const seconds = Math.round((then - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [unit, secondsPerUnit] of units) {
    if (Math.abs(seconds) >= secondsPerUnit) {
      return rtf.format(Math.round(seconds / secondsPerUnit), unit);
    }
  }
  return rtf.format(Math.round(seconds), "second");
};
