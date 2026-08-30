// The homepage hero: the live strip, the claim, and the four figures that support it.

import { useState, useEffect, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { useCountUp } from "../hooks/useCountUp";
import { PROJECT_COUNT, TOTAL_TOOLS, EVIDENCED_COUNT } from "../data/generated";
import { stats as publicStats, formatCount } from "../data/stats";
import { contributions } from "../data/contributions";
import { StatBand, StatFigure } from "./StatFigure";
import { relativeTime } from "../lib/relativeTime";
import { source, longDate, shortDate } from "../lib/provenance";
import { useNow } from "../lib/useNow";
import AvailabilityPill from "./AvailabilityPill";
import AmbientCanvas from "./AmbientCanvas";
import { Tooltip } from "./Tooltip";

const DOCKER_HUB_URL = "https://hub.docker.com/u/mibtisam";
const GITHUB_URL = "https://github.com/ibtisam-iq";
const PROJECTS_SITE = "https://projects.ibtisam-iq.com";

const hidden = (delay: number): CSSProperties => ({
  opacity: 0,
  transform: "translateY(20px)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
  transitionDelay: `${delay}ms`,
});

const shown = (delay: number): CSSProperties => ({
  opacity: 1,
  transform: "translateY(0)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
  transitionDelay: `${delay}ms`,
});

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const projectCount = useCountUp(PROJECT_COUNT, 1400, mounted);
  const pullCount = useCountUp(publicStats.dockerPulls, 2200, mounted);
  const contributionCount = useCountUp(contributions.total, 2000, mounted);
  const s = (d: number) => (mounted ? shown(d) : hidden(d));

  // Ages the shipping line while the tab is open. A minute is the smallest unit
  // `relativeTime` prints, so ticking faster would redraw for nothing.
  const now = useNow(60000);


  // Ordered by what a stranger cannot fake over a weekend. The first two were counted by
  // Docker and GitHub rather than by this site, which is why both link out to the page
  // that proves them.
  const heroStats = [
    {
      value: formatCount(pullCount),
      widthOf: formatCount(publicStats.dockerPulls),
      label: "Docker pulls",
      sub: `${publicStats.dockerImages} images \u00b7 ${shortDate(publicStats.measuredAt)}`,
      href: DOCKER_HUB_URL,
      title: source("Docker Hub", publicStats.measuredAt),
    },
    {
      value: formatCount(contributionCount),
      widthOf: formatCount(contributions.total),
      label: "GitHub contributions",
      sub: `${contributions.activeDays} active days`,
      href: GITHUB_URL,
      title: source("GitHub", contributions.measuredAt),
    },
    {
      value: String(projectCount),
      widthOf: String(PROJECT_COUNT),
      label: "Documented projects",
      sub: `${TOTAL_TOOLS} tools, ${EVIDENCED_COUNT} evidenced`,
      href: PROJECTS_SITE,
      title: source("projects.ibtisam-iq.com", publicStats.measuredAt),
    },
    {
      value: "2",
      label: "CNCF certifications",
      sub: "CKA and CKAD",
      href: "/certificates",
      // The only figure here nothing counts, so it names where to check instead.
      title: "Credential IDs on the certifications page",
    },
  ];

  return (
    <section className="relative overflow-hidden pb-4 pt-5 md:pb-6 md:pt-6">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,180,216,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,216,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Sits over the grid and under everything else. Renders nothing at all under
          reduced motion, and stops its loop when the tab is hidden or the hero is
          scrolled past. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <AmbientCanvas />
      </div>

      <div className="page-frame relative">
        {/* The live strip, and the first line on the page. It holds the two facts here
            that are true right now rather than at build time, which is why they share a
            row and why nothing else on this screen is allowed into it. */}
        {now !== null && (
          <div
            style={s(0)}
            className="mb-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-b border-light-border pb-4 dark:border-border-subtle"
          >
            <Tooltip
              text={`Newest push across all public repos \u00b7 ${longDate(publicStats.lastShipped.pushedAt)}`}
            >
              {(t) => (
                <a
                  href={publicStats.lastShipped.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.1em] text-light-muted transition-colors hover:text-teal-accent dark:text-text-faint dark:hover:text-teal-accent"
                  {...t}
                >
              <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-green-500 dark:bg-green-400" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-green-400" />
              </span>
              shipped
              <span className="font-semibold text-light-text dark:text-text-primary">
                {publicStats.lastShipped.repo}
              </span>
                  {relativeTime(publicStats.lastShipped.pushedAt, now)}
                </a>
              )}
            </Tooltip>

            {/* `status`, not the badge: at the top of the page a tinted panel would take
                the fold ahead of the h1. See src/components/AvailabilityPill.tsx. */}
            <AvailabilityPill variant="status" />
          </div>
        )}

        {/*
         * Claim left, the figures backing it right. The ratio is measured against this
         * heading, which is hand-rolled and breaks about 60px sooner than `.title-page`:
         * re-measure on the rendered element. `lg`, not `md`, or the band is crushed.
         */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-16">
          {/* Text (left on desktop, top on mobile) */}
          <div className="min-w-0">
          <p
            style={s(0)}
            className="eyebrow"
          >
            DevOps & Cloud Engineer
          </p>

          <h1
            style={s(100)}
            className="text-5xl md:text-6xl font-bold mb-5 text-light-text dark:text-white leading-tight"
          >
            I think in{" "}
            <span className="text-teal-accent">
              systems
            </span>
            , not tools.
          </h1>

          <p
            style={s(180)}
            className="font-mono text-sm tracking-wide text-teal-accent mb-6"
          >
            kubernetes · aws · ci/cd · gitops
          </p>

          <p
            style={s(250)}
            className="text-lg leading-relaxed max-w-2xl text-light-muted dark:text-gray-300 mb-10"
          >
            CKA and CKAD certified. I build Kubernetes clusters, CI/CD
            pipelines, and cloud infrastructure from first principles. Every
            project documented with source code and a runbook, plus
            terminal sessions on the ones worth replaying.
          </p>

          {/* One filled button, pointing at the evidence: two solid buttons is two
              primaries and therefore none. */}

          {/* Stacked and full width below `sm`, or each button sits at its own text width
              and the pair reads as a ragged edge with no ranking. */}

          {/* No bottom margin: the figure band this once separated is in the other column
              now, and the leftover space would end this box below its last visible pixel. */}
          <div
            style={s(330)}
            className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <a
              href={PROJECTS_SITE}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-7 py-3.5 text-center text-base font-semibold bg-light-text text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-surface-0"
            >
              View the projects &#8599;
            </a>
            <Link
              to="/contact"
              className="rounded-lg border border-light-border px-7 py-3.5 text-center text-base font-semibold text-light-text transition-colors hover:border-teal-accent hover:text-teal-accent dark:border-border-subtle dark:text-text-primary dark:hover:border-teal-accent dark:hover:text-teal-accent"
            >
              Get in touch
            </Link>
          </div>

          </div>

          {/* Two across on a phone, where this is the full frame; one from `lg`, where it
              is a 412px column. See the `column` entry in StatFigure's `COLUMNS`. */}
          <div style={s(450)}>
            <StatBand columns="column">
              {heroStats.map((stat) => (
                <StatFigure key={stat.label} tier="headline" {...stat} />
              ))}
            </StatBand>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() =>
              document
                .getElementById("projects-cta")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-hidden="true"
            tabIndex={-1}
            className="animate-bounce-gentle text-light-muted/50 dark:text-text-faint/50 hover:text-teal-accent dark:hover:text-teal-accent transition-colors"
          >
            <FiChevronDown size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
