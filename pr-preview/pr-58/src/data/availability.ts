// HAND-MAINTAINED. Nothing measures employment status, so this file is not generated.
// Setting `open` to false removes the pill and the footer line. Widening the copy changes
// what is being offered; see REFERENCE.md.

export interface Availability {
  open: boolean
  /** Fits in a pill. Keep it under about 40 characters. */
  headline: string
  /** The words in `headline` to emphasise. Must appear there verbatim: a mismatch renders
   *  the headline plain rather than dropping words. */
  emphasis: string
  /** The qualifier. One line, and it has to survive being read on its own. */
  detail: string
  /** Reviewed by hand on this date. Shown as a title so the claim carries one. */
  checkedOn: string
}

export const availability: Availability = {
  open: true,
  headline: "Available for DevOps and cloud engineering roles",
  emphasis: "DevOps and cloud",
  detail: "Immediate start · Pakistan or remote",
  checkedOn: "2026-08-28",
}
