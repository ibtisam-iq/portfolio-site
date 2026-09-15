// The ecosystem grid: five sites, each a place the work is published.

import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView";
import { RevealChild } from "./Reveal";
import { PROJECT_COUNT, PROJECTS_URL } from "../data/generated";

/**
 * The canonical five places the work lives; src/components/Footer.tsx lists the same five.
 * Each card carries its accent at rest, not on hover, or the grid is five identical
 * rectangles and every reader on a phone sees only that.
 */
const SURFACES = [
  {
    name: "Nectar",
    blurb: "365 pages of notes, written while learning",
    host: "nectar.ibtisam-iq.com",
    url: "https://nectar.ibtisam-iq.com",
    rail: "bg-teal-accent",
    text: "group-hover:text-teal-accent",
    edge: "hover:border-teal-accent/50",
  },
  {
    name: "SilverStack",
    blurb: "Reusable scripts, images and systemd units",
    host: "github.com/ibtisam-iq",
    url: "https://github.com/ibtisam-iq/silver-stack",
    rail: "bg-teal-accent",
    text: "group-hover:text-teal-accent",
    edge: "hover:border-teal-accent/50",
  },
  {
    name: "Blog",
    blurb: "Problem-first debugging write-ups",
    host: "blog.ibtisam-iq.com",
    url: "https://blog.ibtisam-iq.com",
    rail: "bg-teal-accent",
    text: "group-hover:text-teal-accent",
    edge: "hover:border-teal-accent/50",
  },
  {
    name: "Projects",
    blurb: `${PROJECT_COUNT} documented builds, source and runbook each`,
    host: "projects.ibtisam-iq.com",
    url: PROJECTS_URL,
    rail: "bg-teal-accent",
    text: "group-hover:text-teal-accent",
    edge: "hover:border-teal-accent/50",
  },
  {
    name: "Runbook",
    blurb: "Searchable MkDocs of daily decisions",
    host: "runbook.ibtisam-iq.com",
    url: "https://runbook.ibtisam-iq.com",
    rail: "bg-teal-accent",
    text: "group-hover:text-teal-accent",
    edge: "hover:border-teal-accent/50",
  },
];

const Ecosystem = () => {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <section
      className="section-y text-light-text dark:text-text-primary"
      ref={ref}
    >
      <div className="page-frame">
        <RevealChild visible={inView} delay={0}>
          {/* The heading used to run down the left edge with the whole right half
              empty. The link that was buried mid-paragraph now anchors that side. */}
          <div className="mb-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="eyebrow">
                The ecosystem
              </p>
              <h2 className="title-section mb-3">
                Five places the work lives
              </h2>
              <p className="max-w-xl text-light-muted dark:text-text-muted">
                Build it, understand it, write it down, ship it. Each stage has its
                own site, and all five are public.
              </p>
            </div>

            {/* Was a plain anchor, which tore down and rebooted the whole app to move
                between two pages of it. */}
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-muted transition-colors hover:border-teal-accent/50 hover:text-teal-accent dark:border-border-subtle dark:text-text-muted"
            >
              How that pipeline works
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        </RevealChild>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SURFACES.map((s, i) => (
            <RevealChild key={s.name} visible={inView} delay={80 + i * 60}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`panel panel-link group relative flex h-full flex-col overflow-hidden p-4 pt-5 ${s.edge}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-[3px] opacity-60 transition-opacity duration-200 group-hover:opacity-100 ${s.rail}`}
                />
                <span className="mb-1.5 flex items-baseline justify-between gap-2">
                  <span
                    className={`text-base font-bold transition-colors ${s.text}`}
                  >
                    {s.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-xs text-light-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-text-faint"
                  >
                    ↗
                  </span>
                </span>
                <span className="flex-1 text-[13px] leading-snug text-light-muted dark:text-text-muted">
                  {s.blurb}
                </span>
                <span className="mt-3 block truncate font-mono text-[10px] uppercase tracking-[0.06em] text-light-faint dark:text-text-faint">
                  {s.host}
                </span>
              </a>
            </RevealChild>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
