import type { CSSProperties } from "react";
import { useInView } from "../hooks/useInView";
import { useTypewriter } from "../hooks/useTypewriter";

const LOG_LINES = [
  "$ cat methodology.log",
  "[phase-02] silverstack   -> reusable infra, run again not read once",
  "[phase-02] blog          -> distilled, problem-first write-ups",
  "[phase-02] projects      -> integrated systems, end-to-end pipelines",
  "[phase-02] runbook       -> daily decisions and debugging, written while fresh",
  "[phase-01] nectar        -> 200+ pages, survived contact with reality",
  "---------------------------------------------------------------",
  "status: nothing here is a tutorial followed once",
];

const OUTPUTS = [
  {
    title: "Repeatable",
    body: "If I build it more than once, it becomes a script, a module, or a container image. SilverStack collects the reusable pieces: provisioning scripts, OCI rootfs images, systemd units.",
    accent: "text-green-600 dark:text-green-400",
    bar: "bg-green-600 dark:bg-green-400",
    label: "SilverStack",
    url: "https://github.com/ibtisam-iq/silver-stack",
  },
  {
    title: "Explained",
    body: "If something cost me hours to debug or understand, it becomes a write-up. Problem first, solution second, no filler.",
    accent: "text-orange-500 dark:text-orange-400",
    bar: "bg-orange-500 dark:bg-orange-400",
    label: "Blog",
    url: "https://blog.ibtisam-iq.com",
  },
  {
    title: "Assembled",
    body: "When the pieces come together into something end-to-end, it becomes a project with its own repo, domain, and deployment pipeline.",
    accent: "text-purple-600 dark:text-purple-400",
    bar: "bg-purple-600 dark:bg-purple-400",
    label: "Projects",
    url: "https://projects.ibtisam-iq.com",
  },
  {
    title: "Documented",
    body: "Every decision, debugging session, and config change gets written down while it's still fresh. A searchable MkDocs site, not a pile of bookmarks.",
    accent: "text-blue-500 dark:text-blue-400",
    bar: "bg-blue-500 dark:bg-blue-400",
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
      <div className="h-6 w-px bg-gradient-to-b from-teal-accent/40 to-transparent" />
      <div className="my-0.5 h-2 w-2 rounded-full border border-teal-accent/40" />
      <div className="h-6 w-px bg-gradient-to-b from-transparent to-teal-accent/40" />
    </div>
  </div>
);

const Methodology = () => {
  const { ref: pipelineRef, inView } = useInView({ threshold: 0.15 });
  const typed = useTypewriter(LOG_LINES, inView);

  const fade = (delay: number): CSSProperties =>
    prefersReducedMotion()
      ? {}
      : {
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
        };

  return (
    <section className="py-20 text-light-text dark:text-text-primary">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-16 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-light-muted dark:text-text-faint">
            Methodology
          </p>
          <h2 className="mb-4 text-4xl font-extrabold text-light-text dark:text-text-primary md:text-5xl">
            How I Work
          </h2>
          <p className="mx-auto max-w-xl text-lg text-light-muted dark:text-text-muted">
            Every project on this site moves through the same pipeline. Two ways
            in, one synthesis stage, four ways out.
          </p>
        </div>

        <div ref={pipelineRef}>
          {/* PHASE 00: TRIGGER */}
          <div className="mb-5 flex items-baseline gap-3" style={fade(0)}>
            <span className="font-mono text-[40px] font-bold leading-none text-red-500/20 dark:text-red-400/20">
              00
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
              trigger
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className="relative overflow-hidden rounded-xl border border-light-border bg-light-surface p-6 dark:border-border-subtle dark:bg-surface-1"
              style={fade(80)}
            >
              <div
                className="absolute inset-y-0 left-0 w-1 bg-red-500 dark:bg-red-400"
                aria-hidden="true"
              />
              <h3 className="mb-2 text-lg font-semibold text-red-500 dark:text-red-400">
                Don't understand it
              </h3>
              <p className="text-sm text-light-muted dark:text-text-muted">
                Build the mental model first, from first principles, before any
                of it touches real infrastructure.
              </p>
            </div>

            <div
              className="relative overflow-hidden rounded-xl border border-light-border bg-light-surface p-6 dark:border-border-subtle dark:bg-surface-1"
              style={fade(160)}
            >
              <div
                className="absolute inset-y-0 left-0 w-1 bg-purple-600 dark:bg-purple-400"
                aria-hidden="true"
              />
              <h3 className="mb-2 text-lg font-semibold text-purple-600 dark:text-purple-400">
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
            <span className="font-mono text-[40px] font-bold leading-none text-teal-accent/20">
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
                200+ pages. A concept doesn't count as understood until it
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
            <span className="font-mono text-[40px] font-bold leading-none text-green-500/20 dark:text-green-400/20">
              02
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
              output
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OUTPUTS.map((card, i) => (
              <div
                key={card.title}
                className="relative flex flex-col overflow-hidden rounded-xl border border-light-border bg-light-surface p-6 dark:border-border-subtle dark:bg-surface-1"
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

        {/* Terminal summary */}
        <div className="mt-16 border-t border-light-border pt-12 dark:border-border-subtle">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-light-border dark:border-border-subtle">
            <div className="flex items-center gap-1.5 border-b border-light-border bg-light-surface-2 px-4 py-2.5 dark:border-border-subtle dark:bg-surface-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <span className="ml-3 font-mono text-xs text-light-muted dark:text-text-faint">
                methodology.log
              </span>
            </div>
            <pre className="min-h-[140px] overflow-x-auto bg-light-surface px-4 py-4 font-mono text-[13px] leading-relaxed text-green-700 dark:bg-surface-0 dark:text-green-400">
              {typed.join("\n")}
              <span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-green-700 align-middle dark:bg-green-400" />
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
