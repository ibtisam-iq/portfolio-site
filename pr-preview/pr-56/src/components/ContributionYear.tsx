// A year of GitHub activity as a grid of days, with the figures that summarise it.
// The data is src/data/contributions.ts, written at build time.

import { contributions } from "../data/contributions";
import { StatBand, StatFigure } from "./StatFigure";
import { longDate } from "../lib/provenance";

const PROFILE_URL = "https://github.com/ibtisam-iq";

// GitHub's five shades in the site's accent. Index is GitHub's 0 to 4 level. Step 1 is the
// one that matters: too close to the empty cell and the quiet weeks disappear.
const SHADES = [
  "bg-[#e3e7ec] dark:bg-[#1c2128]",
  "bg-[#86d0e8] dark:bg-[#0a4b63]",
  "bg-[#3fb3d8] dark:bg-[#00708f]",
  "bg-[#0d92bf] dark:bg-[#0095bd]",
  "bg-[#00669c] dark:bg-[#00b4d8]",
];

const DAY_MS = 86400000;

const dateAt = (index: number) =>
  new Date(Date.parse(`${contributions.start}T00:00:00Z`) + index * DAY_MS);

const format = (d: Date) =>
  d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// The grid stores dates as positions, the derived figures store them as strings. Two
// readers, one formatter, so a day never renders two different ways on the same page.
const label = (index: number) => format(dateAt(index));
const labelOf = (iso: string) => format(new Date(`${iso}T00:00:00Z`));

const MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/**
 * Which column each month starts in. Relies on `contributions.start` being a Sunday, so a
 * column belongs to the month of its Sunday. The first column is skipped when its month is
 * already more than half over.
 */
const monthColumns = (weeks: number) => {
  const out: { col: number; name: string }[] = [];
  let previous = -1;
  for (let c = 0; c < weeks; c++) {
    const d = dateAt(c * 7);
    const m = d.getUTCMonth();
    if (m !== previous) {
      previous = m;
      if (c === 0 && d.getUTCDate() > 15) continue;
      out.push({ col: c, name: MONTH[m] });
    }
  }
  return out;
};

const ContributionYear = () => {
  const { total, counts, levels, activeDays, longestStreak, busiestDay, measuredAt } =
    contributions;

  // A year with nothing in it would render as a wall of blank squares, which says
  // something worse than saying nothing.
  if (total === 0) return null;

  const days = counts.length;
  const weeks = Math.ceil(days / 7);
  const months = monthColumns(weeks);
  const summary = `${total.toLocaleString("en-US")} GitHub contributions in the year ending ${label(days - 1)}, active on ${activeDays} of ${days} days.`;

  return (
    /*
     * Built like every other section: header outside, panel inside, matching the terminal
     * section on the homepage. The figure band stays outside the panel, because `StatBand`
     * carries its own `glow` and a halo inside a halo blooms in the middle of a card.
     */
    <section aria-labelledby="contribution-year-heading" className="section-y">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <div>
          <p className="eyebrow">
            Still doing it
          </p>
          <h2 id="contribution-year-heading" className="title-section">
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-accent transition-colors hover:text-teal-accent/80"
            >
              {total.toLocaleString("en-US")} contributions
            </a>{" "}
            in the last year
          </h2>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-light-faint dark:text-text-faint">
          github profile at build time &middot; {longDate(measuredAt)}
        </p>
      </div>

      {/* The bridge from the pipeline above: every output it names is git-backed, so a
          commit really is where each stage ends. */}
      <p className="mb-7 max-w-2xl text-lg leading-relaxed text-light-muted dark:text-text-muted">
        Every stage of that pipeline ends in a commit somewhere, and this is a year of them.
        Mostly to my own repositories, so read it as consistency rather than as open source
        collaboration; every square links back to a day that is public and checkable.
      </p>

      <div className="panel beam glow p-6 sm:p-8">
      {/* 53 columns will not fit a phone, so the grid scrolls inside its own box. The
          overflow lives here and never on an ancestor: the page must not scroll sideways. */}

      {/* 13px cells, so the grid fills the panel it sits in without scrolling at any width
          the panel itself reaches. */}
      <div className="overflow-x-auto pb-1">
        <div className="w-max">
          {/* Months, in one grid row rather than a cell each, so a label can start in its
              own column and overhang the next. */}
          <div
            aria-hidden="true"
            className="mb-1.5 grid gap-x-[3px] font-mono text-[10px] leading-none text-light-faint dark:text-text-faint"
            style={{ gridTemplateColumns: `repeat(${weeks}, 13px)` }}
          >
            {months.map((m) => (
              <span key={`${m.name}-${m.col}`} style={{ gridColumn: m.col + 1 }}>
                {m.name}
              </span>
            ))}
          </div>

          <div
            role="img"
            aria-label={summary}
            className="grid grid-flow-col gap-[3px]"
            style={{ gridTemplateRows: "repeat(7, 13px)" }}
          >
            {counts.map((count, i) => (
              <div
                key={i}
                // Native title rather than a custom tooltip: 370 of them, and the browser's
                // own is the one that already works on hover, on focus and on a long press.
                title={`${count === 1 ? "1 contribution" : `${count} contributions`} on ${label(i)}`}
                className={`h-[13px] w-[13px] rounded-[3px] ${SHADES[levels[i]] ?? SHADES[0]}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-light-faint dark:text-text-faint">
        <span className="mr-0.5">less</span>
        {SHADES.map((shade, i) => (
          <span key={i} className={`h-[13px] w-[13px] rounded-[3px] ${shade}`} />
        ))}
        <span className="ml-0.5">more</span>
      </div>
      </div>

      <div className="mt-6">
        <StatBand>
          <StatFigure
            value={activeDays.toLocaleString("en-US")}
            label="days with a contribution"
            sub={`out of ${days}`}
          />
          <StatFigure
            value={longestStreak.toLocaleString("en-US")}
            label="longest unbroken run"
            sub="consecutive days"
          />
          <StatFigure
            value={busiestDay.count.toLocaleString("en-US")}
            label="busiest single day"
            sub={labelOf(busiestDay.date)}
          />
        </StatBand>
      </div>
    </section>
  );
};

export default ContributionYear;
