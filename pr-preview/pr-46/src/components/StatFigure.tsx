// A measured figure, and the band that lays a row of them out.

import { Children, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "./Tooltip";

/**
 * The only two sizes a measured figure may be. `headline` is the homepage band, once;
 * `section` is up to three figures backing a section's claim. There is no third tier.
 */
export type FigureTier = "headline" | "section";

const SIZE: Record<FigureTier, string> = {
  headline: "text-[34px] sm:text-[40px] lg:text-[44px]",
  section: "text-[26px] sm:text-[32px]",
};

export interface StatFigureProps {
  /** The number as it should read, already formatted and grouped. */
  value: string;
  /** What it counts. Sits under the figure, never beside it. */
  label: ReactNode;
  /** Supporting detail: units, a scope, an "as of" date. */
  sub?: ReactNode;
  tier?: FigureTier;
  href?: string;
  title?: string;
  /** The final value, while `value` counts up to it. Its width is held open so the row
   *  cannot reflow mid-animation. */
  widthOf?: string;
}

export const StatFigure = ({
  value,
  label,
  sub,
  tier = "section",
  href,
  title,
  widthOf,
}: StatFigureProps) => {
  const figure = (
    <span
      className={`relative block font-mono font-bold leading-none tracking-tight tabular-nums text-light-text transition-colors group-hover:text-teal-accent dark:text-text-primary ${SIZE[tier]}`}
    >
      {/* Holds the final width open while the visible value counts up to it. */}
      {widthOf && widthOf !== value && (
        <span aria-hidden="true" className="invisible">
          {widthOf}
        </span>
      )}
      <span className={widthOf && widthOf !== value ? "absolute inset-0" : undefined}>
        {value}
      </span>
    </span>
  );

  const body = (
    <>
      {/* The affordance. Without it the only signal that a cell is a link is its hover
          state, which a touch device never shows and a scanning reader never triggers. It
          stays faint until hover so it does not compete with the figure. */}
      {href && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 z-[2] text-[11px] leading-none text-light-faint transition-all duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-teal-accent dark:text-text-faint"
        >
          {href.startsWith("/") ? "\u2192" : "\u2197"}
        </span>
      )}
      {/* Lifted above the cell's hover wash, which is generated content and therefore
          paints after every child of the cell. */}
      <span className="relative z-[1] block">
        {figure}
        <span className="mt-2.5 block text-[11.5px] leading-snug text-light-muted dark:text-text-muted sm:text-xs">
          {label}
        </span>
        {/* 10px is the floor the rest of the site uses for mono meta. Anything tighter is
            the only value below it anywhere, and buys no line back: the longest string
            here wraps at both sizes on a phone. */}
        {sub && (
          <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.06em] text-light-faint dark:text-text-faint">
            {sub}
          </span>
        )}
      </span>
    </>
  );

  // Generous down, tight across: in a full-width band, wider horizontal padding wraps the
  // sub-line and makes one cell taller than its neighbours. The `column` layout inverts
  // this through the `[&>*]` overrides on the band.
  const cell =
    "relative block bg-light-bg px-4 py-6 dark:bg-surface-0 sm:px-5";

  // A cell sits inside a hairline band, so it cannot carry the border-and-glow hover the
  // cards use. The wash and the figure colour are the whole signal; `.stat-cell` in
  // src/index.css has why it adds light rather than repainting the rectangle.
  const interactive = "stat-cell group";

  // An internal route goes through the router. A plain anchor would work, but it would
  // tear down and reboot the whole app to move between two pages of the same one.
  return (
    <Tooltip text={title}>
      {(t) =>
        !href ? (
          <div className={cell} {...t}>
            {body}
          </div>
        ) : href.startsWith("/") ? (
          <Link to={href} className={`${cell} ${interactive}`} {...t}>
            {body}
          </Link>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cell} ${interactive}`}
            {...t}
          >
            {body}
          </a>
        )
      }
    </Tooltip>
  );
};

// Tailwind scans source text for class names, so these cannot be interpolated. Two columns
// on a phone in every case: below that, a headline figure starts wrapping its own digits.
const COLUMNS: Record<string, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  // The hero's band: the full frame on a phone, a single column from `lg`, where two
  // across would leave a five-digit headline figure 50px of room. The cells also swap
  // their padding asymmetry there, for the reason above `cell`.
  column: "grid-cols-2 lg:grid-cols-1 lg:[&>*]:px-6 lg:[&>*]:py-3",
};

/**
 * Lays figures out as a hairline grid: the 1px gaps are the dividers, painted by
 * `.stat-band`. Columns follow the child count, so a band whose figure count varies at
 * build time never renders an empty cell. Cap the width only for a genuinely narrow column.
 */
export const StatBand = ({
  children,
  columns,
}: {
  children: ReactNode;
  /**
   * Force a column count. The default map keys off the viewport, which is not the width of
   * the track holding the band, so a caller inside a column has to declare what it knows.
   */
  columns?: 1 | 2 | 3 | 4 | "column";
}) => {
  const count = Children.toArray(children).length;
  const cols = columns ? COLUMNS[columns] : (COLUMNS[count] ?? COLUMNS[4]);

  // No halo in the hero: `.glow` is for the element that is the point of its screen, and
  // there that is the headline, not the evidence under it.
  const halo = columns === "column" ? "" : "glow";

  return (
    <div className={`panel stat-band ${halo} grid gap-px overflow-hidden ${cols}`}>
      {children}
    </div>
  );
};
