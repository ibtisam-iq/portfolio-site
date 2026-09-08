// Where a figure came from. A provenance string names a source and a date and stops
// there; it never describes how the number was produced.


/** 2026-08-28 renders as "28 Aug 2026". Unambiguous everywhere, unlike 08/28. */
export const longDate = (iso: string): string =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })

/** The same date without the year: the tooltip carries the year, the micro copy does not. */
export const shortDate = (iso: string): string =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  })

/** Who counted it and when. The optional qualifier goes first, and only when the figure's
 *  own label cannot carry it. */
export const source = (name: string, iso: string, qualifier?: string): string =>
  qualifier ? `${qualifier} · ${name}, ${longDate(iso)}` : `${name}, ${longDate(iso)}`
