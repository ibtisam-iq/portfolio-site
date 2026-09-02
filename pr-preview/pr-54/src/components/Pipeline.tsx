// How a project moves from work to published surface.

import type { CSSProperties } from "react";
import { useInView } from "../hooks/useInView";

const OUTPUTS = [
  {
    title: "Repeatable",
    body: "If I build it more than once, it becomes a script, a module, or a container image. SilverStack collects the reusable pieces: provisioning scripts, OCI rootfs images, systemd units.",
    accent: "text-teal-accent",
    bar: "bg-teal-accent",
    label: "SilverStack",
    url: "https://github.com/ibtisam-iq/silver-stack",
  },
  {
    title: "Explained",
    body: "If something cost me hours to debug or understand, it becomes a write-up. Problem first, solution second, no filler.",
    accent: "text-teal-accent",
    bar: "bg-teal-accent",
    label: "Blog",
    url: "https://blog.ibtisam-iq.com",
  },
  {
    title: "Assembled",
    body: "When the pieces come together into something end-to-end, it becomes a project with its own repo, domain, and deployment pipeline.",
    accent: "text-teal-accent",
    bar: "bg-teal-accent dark:bg-teal-accent",
    label: "Projects",
    url: "https://projects.ibtisam-iq.com",
  },
  {
    title: "Documented",
    body: "Every decision, debugging session, and config change gets written down while it's still fresh. A searchable MkDocs site, not a pile of bookmarks.",
    accent: "text-teal-accent dark:text-teal-accent",
    bar: "bg-teal-accent dark:bg-teal-accent",
    label: "Runbook",
    url: "https://runbook.ibtisam-iq.com",
  },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const Connector = ({ style }: { style?: CSSProperties }) => (
  <div className="flex justify-center py-3" style={style}>
    <div className="flex flex-col items-center">
      <div className="h-6 w-px bg-linear-to-b from-teal-accent/40 to-transparent" />
      <div className="my-0.5 h-2 w-2 rounded-full border border-teal-accent/40" />
      <div className="h-6 w-px bg-linear-to-b from-transparent to-teal-accent/40" />
    </div>
  </div>
);

/**
 * The three stages every project moves through, and the surface each produces. It lives on
 * About because it is true and cannot be checked in one click, so it belongs after an essay
 * rather than on a homepage a stranger is scanning.
 */
const Pipeline = () => {
  const { ref: pipelineRef, inView } = useInView({ threshold: 0.15 });

  const fade = (delay: number): CSSProperties =>
    prefersReducedMotion()
      ? {}
      : {
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
        };

  return (
    <section className="section-y text-light-text dark:text-text-primary">
      <div>
        <div className="mb-10">
          <p className="eyebrow">
            Methodology
          </p>
          <h2 className="title-section mb-4">
            How I work
          </h2>
          <p className="max-w-2xl text-lg text-light-muted dark:text-text-muted">
            Every project on this site moves through the same pipeline. Two ways in,
            one synthesis stage, four ways out.
          </p>
        </div>

        <div ref={pipelineRef}>
          {/* PHASE 00: TRIGGER */}
          <div className="mb-5 flex items-baseline gap-3" style={fade(0)}>
            <span aria-hidden="true" className="font-mono text-xl font-bold leading-none text-light-faint/40 dark:text-text-faint/40">
              00
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-light-muted dark:text-text-muted">
              trigger
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className="panel relative overflow-hidden p-6"
              style={fade(80)}
            >
              <div
                className="absolute inset-y-0 left-0 w-1 bg-light-muted dark:bg-text-muted"
                aria-hidden="true"
              />
              <h3 className="mb-2 text-lg font-semibold text-light-muted dark:text-text-muted">
                Don't understand it
              </h3>
              <p className="text-sm text-light-muted dark:text-text-muted">
                Build the mental model first, from first principles, before any
                of it touches real infrastructure.
              </p>
            </div>

            <div
              className="panel relative overflow-hidden p-6"
              style={fade(160)}
            >
              <div
                className="absolute inset-y-0 left-0 w-1 bg-teal-accent dark:bg-teal-accent"
                aria-hidden="true"
              />
              <h3 className="mb-2 text-lg font-semibold text-teal-accent">
                Run it for real
              </h3>
              <p className="text-sm text-light-muted dark:text-text-muted">
                Full implementation. The debugging, the 2am redirect loop, the
                parts that never make it into a README.
              </p>
            </div>
          </div>

          <Connector style={fade(240)} />

          {/* PHASE 01: SYNTHESIS */}
          <div className="mb-5 flex items-baseline gap-3" style={fade(300)}>
            <span aria-hidden="true" className="font-mono text-xl font-bold leading-none text-teal-accent/20">
              01
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-accent">
              synthesis
            </span>
          </div>

          <div className="flex justify-center" style={fade(380)}>
            <a
              href="https://nectar.ibtisam-iq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full rounded-2xl border border-teal-accent/30 bg-light-surface p-8 text-center shadow-[0_0_40px_-12px_rgba(0,180,216,0.25)] transition hover:border-teal-accent/60 dark:bg-surface-1 md:w-auto md:min-w-[400px]"
            >
              <h3 className="mb-3 text-2xl font-bold text-teal-accent transition group-hover:text-teal-accent/80">
                Nectar
              </h3>
              <p className="mb-4 text-sm text-light-muted dark:text-text-muted">
                365 pages. A concept doesn't count as understood until it
                survives contact with what I actually built.
              </p>
              <span className="font-mono text-xs text-teal-accent transition group-hover:text-teal-accent/80">
                nectar.ibtisam-iq.com ↗
              </span>
            </a>
          </div>

          <Connector style={fade(440)} />

          {/* PHASE 02: OUTPUT */}
          <div className="mb-5 flex items-baseline gap-3" style={fade(500)}>
            <span aria-hidden="true" className="font-mono text-xl font-bold leading-none text-teal-accent/20">
              02
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-accent">
              output
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OUTPUTS.map((card, i) => (
              <div
                key={card.title}
                className="panel relative flex flex-col overflow-hidden p-6"
                style={fade(560 + i * 80)}
              >
                <div
                  className={`absolute left-0 right-0 top-0 h-1 ${card.bar}`}
                  aria-hidden="true"
                />
                <h3 className={`mb-2 text-lg font-semibold ${card.accent}`}>
                  {card.title}
                </h3>
                <p className="flex-1 text-sm text-light-muted dark:text-text-muted">
                  {card.body}
                </p>
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 text-sm font-medium transition hover:opacity-80 ${card.accent}`}
                >
                  {card.label} ↗
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pipeline;
