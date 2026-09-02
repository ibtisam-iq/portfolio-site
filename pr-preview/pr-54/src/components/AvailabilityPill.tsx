// The availability status, in its three forms.

import { availability } from "../data/availability";
import { longDate } from "../lib/provenance";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "./Tooltip";

/**
 * Renders nothing when `availability.open` is false. Three forms, differing only in chrome
 * and register: `pill` standalone with its own edge, `bare` for a caller that already
 * provides a container, `status` for the hero strip.
 */
type Variant = "pill" | "bare" | "status";

const AvailabilityPill = ({ variant = "pill" }: { variant?: Variant } = {}) => {
  if (!availability.open) return null;

  const chrome =
    variant === "pill"
      ? "rounded-2xl border border-green-600/25 bg-green-500/[0.07] py-2 pl-3.5 pr-4 dark:border-green-400/25 dark:bg-green-400/[0.07] sm:rounded-full"
      : "";

  // Quiet by design: a tinted badge here would take the fold ahead of the h1. The green
  // stays, or it stops being a status line.
  const status = variant === "status";

  // Split so the informative words can be emphasised. A miss falls through to the plain
  // sentence rather than dropping words.
  const at = availability.headline.indexOf(availability.emphasis);
  const parts =
    status && at !== -1
      ? {
          before: availability.headline.slice(0, at),
          mid: availability.emphasis,
          after: availability.headline.slice(at + availability.emphasis.length),
        }
      : null;

  // On the strip this is a link, which is what earns it the neighbouring item's hover
  // colour. Painting that hover on a `div` instead would promise a click that never
  // happens, so it goes where the sentence already points: the contact page.
  const shared = `inline-flex items-start gap-2.5 ${chrome}`;
  const wrap = (inner: ReactNode, t: Record<string, unknown>) =>
    status ? (
      <Link
        to="/contact"
        className={`${shared} transition-colors hover:text-teal-accent`}
        {...t}
      >
        {inner}
      </Link>
    ) : (
      <div className={shared} {...t}>
        {inner}
      </div>
    );

  return (
    <Tooltip text={`Confirmed by hand, ${longDate(availability.checkedOn)}`}>
      {(t) => wrap(
        <>
          {/* The dot has its own column, so a wrapped pill starts its qualifier under the
              headline rather than under the dot. */}

          {/* Centred on the first line, not the block, like every other status dot here.
              The height is `leading-snug` against the headline's own size, so the two line
              boxes cannot drift apart. */}
          <span
            className={`flex shrink-0 items-center ${status ? "h-[1.45em] text-[11px]" : "h-[1.375em] text-[13px]"}`}
            aria-hidden="true"
          >
            <span className={`relative flex ${status ? "h-1.5 w-1.5" : "h-2 w-2"}`}>
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-green-500 dark:bg-green-400" />
              <span
                className={`relative inline-flex rounded-full bg-green-600 dark:bg-green-400 ${status ? "h-1.5 w-1.5" : "h-2 w-2"}`}
              />
            </span>
          </span>
          <span
            className={`flex flex-wrap items-baseline gap-y-0.5 ${status ? "gap-x-2" : "gap-x-3"}`}
          >
            {/* On the strip: muted with one emphasised run, matching its neighbour on the
                row. The green belongs to the dot. The pill form keeps a green headline,
                because it shares a line with nothing. */}
            <span
              className={
                status
                  ? "font-mono text-[11px] uppercase leading-snug tracking-widest text-light-muted dark:text-text-faint"
                  : "text-[13px] font-semibold leading-snug text-green-700 dark:text-green-300"
              }
            >
              {parts ? (
                <>
                  {parts.before}
                  <span className="font-semibold text-light-text dark:text-text-primary">
                    {parts.mid}
                  </span>
                  {parts.after}
                </>
              ) : (
                availability.headline
              )}
            </span>
            <span
              className={`font-mono text-[11px] leading-snug ${
                status
                  ? "uppercase tracking-widest text-light-muted dark:text-text-faint"
                  : "text-light-muted dark:text-text-muted"
              }`}
            >
              {availability.detail}
            </span>
          </span>
        </>,
        t as Record<string, unknown>,
      )}
    </Tooltip>
  );
};

export default AvailabilityPill;
