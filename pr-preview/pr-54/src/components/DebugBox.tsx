// The DebugBox section: what the image is, how the three variants compare on size, and
// the commands that run them. Everything shown here comes from src/data/debugbox.ts,
// which scripts/generate-debugbox.js derives from the project's own README.

import { useState, useRef } from "react";
import { FiCheck, FiCopy, FiExternalLink } from "react-icons/fi";
import { useInView } from "../hooks/useInView";
import { RevealChild } from "./Reveal";
import {
  variants,
  comparison,
  standaloneCommand,
  REDUCTION_PCT,
  REPO_URL,
  DOCS_URL,
  TUTORIAL_URL,
} from "../data/debugbox";
import { stats, formatCount } from "../data/stats";
import { StatBand, StatFigure } from "./StatFigure";
import { source, shortDate } from "../lib/provenance";

const CommandRow = ({ label, command }: { label: string; command: string }) => {
  // Clipboard writes reject on an insecure origin, on an unfocused document, and under a
  // permissions policy. Failing silently reads as a dead button, so the fallback selects
  // the command and says so.
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const codeRef = useRef<HTMLElement>(null);

  const selectCommand = () => {
    const node = codeRef.current;
    const selection = window.getSelection();
    if (!node || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      selectCommand();
      setState("failed");
      setTimeout(() => setState("idle"), 4000);
    }
  };

  return (
    <div>
      <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-light-faint dark:text-text-faint">
        {label}
      </p>
      <div className="well well-edge flex items-center gap-2 py-1.5 pl-4 pr-1.5">
        <code
          ref={codeRef}
          className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-1.5 font-mono text-[13px] text-teal-accent"
        >
          {command}
        </code>
        <button
          onClick={copy}
          aria-label={`Copy command: ${command}`}
          className="shrink-0 rounded-md p-2 text-light-muted transition-colors hover:bg-light-surface-2 hover:text-light-text dark:text-text-muted dark:hover:bg-surface-2 dark:hover:text-text-primary"
        >
          {state === "copied" ? (
            <FiCheck size={15} className="text-green-700 dark:text-green-400" />
          ) : (
            <FiCopy size={15} />
          )}
        </button>
      </div>
      {/* Announced to screen readers as well as shown, since the visual cue alone
          would not reach someone who triggered the button from the keyboard. */}
      <p role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "Command copied to clipboard" : ""}
      </p>
      {state === "failed" && (
        <p className="mt-1.5 text-xs text-light-muted dark:text-text-muted">
          Clipboard is blocked here. The command is selected, so press{" "}
          <kbd className="rounded-sm border border-light-border px-1 font-mono text-[11px] dark:border-border-subtle">
            Ctrl
          </kbd>{" "}
          or{" "}
          <kbd className="rounded-sm border border-light-border px-1 font-mono text-[11px] dark:border-border-subtle">
            Cmd
          </kbd>{" "}
          +{" "}
          <kbd className="rounded-sm border border-light-border px-1 font-mono text-[11px] dark:border-border-subtle">
            C
          </kbd>
          .
        </p>
      )}
    </div>
  );
};

const DebugBox = () => {
  const { ref, inView } = useInView();
  const [active, setActive] = useState(
    variants.find((v) => v.isDefault)?.id ?? variants[0].id
  );

  const selected = variants.find((v) => v.id === active) ?? variants[0];
  // Pulls and stars measure different things: a pull can be a CI robot, a star is a
  // person. Worth stating both, which is why this is read here rather than left unused.
  const debugboxStars = stats.starsByRepo.debugbox ?? 0;
  const maxMB = Math.max(comparison.sizeMB, ...variants.map((v) => v.sizeMB));

  return (
    <section
      className="section-y text-light-text dark:text-text-primary"
      ref={ref}
      aria-labelledby="debugbox-heading"
    >
      <div className="page-frame">
        <RevealChild visible={inView} delay={0}>
          <p className="eyebrow">
            Open Source
          </p>
          <h2
            id="debugbox-heading"
            className="mb-4 text-4xl font-bold leading-tight md:text-5xl"
          >
            DebugBox, running in{" "}
            <span className="text-teal-accent">
              one command
            </span>
          </h2>
          <p className="mb-7 max-w-2xl text-lg leading-relaxed text-light-muted dark:text-text-muted">
            A Kubernetes debugging container in three sizes, so a DNS check does not
            pull {comparison.sizeMB} MB. The smallest is {REDUCTION_PCT}% smaller than{" "}
            {comparison.label}.
          </p>

          {/* These three used to live inside the paragraph above, where a reader
              scanning the page saw grey prose rather than the numbers that make the
              case. Pulled out so they are read as evidence, not as sentence. */}
          <div className="mb-10">
            <StatBand>
              <StatFigure
                value={formatCount(stats.debugboxPulls)}
                label="Docker pulls"
                sub={`debugbox image \u00b7 ${shortDate(stats.measuredAt)}`}
                href="https://hub.docker.com/r/mibtisam/debugbox"
                title={source("Docker Hub", stats.measuredAt)}
              />
              {/* starsByRepo only records the top few repos, so a quiet month could drop
                  DebugBox out of it entirely. The figure is omitted rather than shown as
                  zero, which would read as a verdict instead of a gap in the data. */}
              {debugboxStars > 0 && (
                <StatFigure
                  value={String(debugboxStars)}
                  label={debugboxStars === 1 ? "GitHub star" : "GitHub stars"}
                  sub="most starred repo"
                  href={REPO_URL}
                  title={source("GitHub", stats.measuredAt)}
                />
              )}
              <StatFigure
                value={`${REDUCTION_PCT}%`}
                label={`smaller than ${comparison.label}`}
                sub={`${variants[0].sizeMB} MB vs ${comparison.sizeMB} MB`}
                title={source(
                  "DebugBox README",
                  stats.measuredAt,
                  `${variants[0].sizeMB} MB vs ${comparison.sizeMB} MB`
                )}
              />
            </StatBand>
          </div>
        </RevealChild>

        {/* Size comparison */}
        <RevealChild visible={inView} delay={100}>
          <div className="panel mb-8 p-6">
            <p className="label">
              Compressed image size
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                ...variants.map((v) => ({
                  label: `DebugBox ${v.label.toLowerCase()}`,
                  mb: v.sizeMB,
                  mine: true,
                })),
                { label: comparison.label, mb: comparison.sizeMB, mine: false },
              ].map((row) => (
                // Below sm the label sits above its bar. Keeping it inline there left
                // the bars around 60px wide, which is too short to compare against
                // each other, and comparison is the only reason the chart exists.
                <div
                  key={row.label}
                  className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3"
                >
                  <span className="text-sm text-light-muted dark:text-text-muted sm:w-40 sm:shrink-0 sm:truncate">
                    {row.label}
                  </span>
                  <div className="flex flex-1 items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-light-surface-2 dark:bg-surface-2">
                      <div
                        className={`h-2 rounded-full ${
                          row.mine
                            ? "bg-teal-accent"
                            : "bg-light-muted/50 dark:bg-text-faint"
                        }`}
                        style={{
                          width: inView ? `${(row.mb / maxMB) * 100}%` : "0%",
                          transition: "width 0.8s ease-out",
                        }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right font-mono text-sm tabular-nums text-light-text dark:text-text-primary">
                      {row.mb} MB
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealChild>

        {/* Variant picker and commands */}
        <RevealChild visible={inView} delay={200}>
          <div
            className="mb-3 flex flex-wrap gap-2"
            role="tablist"
            aria-label="DebugBox variant"
          >
            {variants.map((v) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={v.id === active}
                onClick={() => setActive(v.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  v.id === active
                    ? "border-teal-accent bg-teal-accent/10 text-teal-accent dark:bg-teal-accent/10 dark:text-teal-accent"
                    : "border-light-border bg-light-surface text-light-muted hover:border-teal-accent/40 dark:border-border-subtle dark:bg-surface-1 dark:text-text-muted"
                }`}
              >
                {v.label}
                <span className="ml-2 font-mono text-xs tabular-nums opacity-70">
                  {v.sizeMB} MB
                </span>
                {v.isDefault && (
                  <span className="ml-2 rounded-sm bg-teal-accent/15 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-teal-accent">
                    default
                  </span>
                )}
              </button>
            ))}
          </div>

          <p className="mb-5 text-sm text-light-muted dark:text-text-muted">
            {selected.tagline}
          </p>

          <div className="flex flex-col gap-3">
            {selected.commands.map((c) => (
              // Keyed by variant too, so switching tabs resets any copied or failed
              // state rather than showing it against a different command.
              <CommandRow
                key={`${selected.id}-${c.label}`}
                label={c.label}
                command={c.command}
              />
            ))}
            <CommandRow
              label="Standalone pod, for clusters older than 1.23"
              command={standaloneCommand}
            />
          </div>
        </RevealChild>

        <RevealChild visible={inView} delay={300}>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {[
              { href: TUTORIAL_URL, label: "Try it in a live cluster" },
              { href: DOCS_URL, label: "Documentation" },
              { href: REPO_URL, label: "Source on GitHub" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-accent transition hover:text-teal-accent dark:hover:text-teal-accent"
              >
                {link.label}
                <FiExternalLink size={13} aria-hidden="true" />
              </a>
            ))}
          </div>
        </RevealChild>
      </div>
    </section>
  );
};

export default DebugBox;
