// The interactive terminal on the homepage.

import { useCallback, useEffect, useRef, useState } from "react";
import { execute, BANNER, COMMAND_NAMES, type Line } from "../data/terminal";
import { stats } from "../data/stats";
import { longDate } from "../lib/provenance";

/**
 * A terminal answering from the site's own data. src/data/terminal.ts holds the commands
 * and the rule that none may simulate infrastructure. The panel holds nothing but the
 * terminal, and the scrollback is a live region so a screen reader hears each answer.
 */

const TONE: Record<string, string> = {
  out: "text-light-text dark:text-text-primary",
  head: "text-teal-accent font-semibold",
  dim: "text-light-faint dark:text-text-faint",
  accent: "text-teal-accent",
  err: "text-red-600 dark:text-red-400",
};

interface Block {
  /** The echoed command, or null for the banner. */
  input: string | null;
  lines: Line[];
}

const OutputLine = ({ line }: { line: Line }) => {
  const tone = TONE[line.tone ?? "out"];
  if (!line.text) return <div className="h-3" aria-hidden="true" />;

  if (line.href) {
    // The indent lives on this `pre-wrap` wrapper, not inside the anchor: an anchor is not
    // `pre`, so leading spaces in its text collapse and the URL loses its column.
    return (
      <div className="whitespace-pre-wrap break-words">
        {line.indent ? " ".repeat(line.indent) : ""}
        <a
          href={line.href}
          target={line.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className={`underline-offset-4 hover:underline ${tone}`}
        >
          {line.text}
        </a>
      </div>
    );
  }

  return <div className={`whitespace-pre-wrap ${tone}`}>{line.text}</div>;
};

// The gap after the `$` is a non-breaking space: the input line's prompt is a flex item
// and drops trailing whitespace, so a plain space puts the caret flush against the `$`.

// `musk` is short for muskurahat, the Urdu for the smile that Ibtisam means. The host is
// the domain this is served from, which is what a shell prompt names.
const Prompt = () => (
  <span
    className="select-none font-semibold text-green-700 dark:text-green-400"
    aria-hidden="true"
  >
    {"musk@ibtisam-iq:~$\u00a0"}
  </span>
);

const Terminal = () => {
  // Opens with `whoami` already run, echoed exactly as a typed run would be, so a reader
  // who never types still sees what this is and gets the answer they came for.
  const [blocks, setBlocks] = useState<Block[]>(() => [
    { input: null, lines: BANNER },
    { input: "whoami", lines: execute("whoami").lines },
  ]);
  const [value, setValue] = useState("");
  // Newest last, the way a shell keeps it. `cursor` is an index into this array, or the
  // length when the user is on a fresh line.
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scrolls the scrollback, never the page, and never for the opening content.

  // The guard compares array identity rather than a flag: StrictMode runs this effect twice
  // on mount, and a boolean would let the second run scroll anyway.
  const opening = useRef(blocks);
  useEffect(() => {
    if (blocks === opening.current) return;
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [blocks]);

  const submit = useCallback((raw: string) => {
    const input = raw.trim();
    if (!input) return;

    setHistory((h) => {
      const next = h[h.length - 1] === input ? h : [...h, input];
      setCursor(next.length);
      return next;
    });

    const result = execute(input);
    setBlocks((b) => (result.clear ? [] : [...b, { input, lines: result.lines }]));
    setValue("");
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit(value);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      const next = Math.min(history.length, cursor + 1);
      setCursor(next);
      setValue(next === history.length ? "" : history[next]);
      return;
    }
    if (e.key === "Tab") {
      // Completes the command word only. Arguments are open-ended, so there is nothing
      // honest to complete them against.
      const [word, ...rest] = value.split(/\s+/);
      if (rest.length || !word) return;
      const hit = COMMAND_NAMES.find((n) => n.startsWith(word.toLowerCase()));
      if (!hit) return;
      e.preventDefault();
      setValue(hit);
    }
  };

  return (
    <section className="section-y text-light-text dark:text-text-primary">
      <div className="page-frame">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
          <div>
            <p className="eyebrow mb-2">
              Ask the site
            </p>
            <h2 className="title-section">
              Every answer comes from a file
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-light-faint dark:text-text-faint">
            generated at build time &middot; {longDate(stats.measuredAt)}
          </p>
        </div>

        <div className="panel beam glow overflow-hidden">
          <div className="flex items-center gap-1.5 border-b border-light-border px-4 py-2.5 dark:border-white/[0.07]">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            <span className="ml-3 font-mono text-xs text-light-faint dark:text-text-faint">
              ibtisam-iq.com
            </span>
          </div>

          {/* A click anywhere in the body focuses the input, which is what a terminal does.
              It is not the only way in: the input is in the tab order. */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="well cursor-text px-4 py-4"
          >
            <div
              ref={scrollRef}
              aria-live="polite"
              className="h-[340px] overflow-y-auto font-mono text-[13px] leading-relaxed"
            >
              {blocks.map((block, i) => (
                <div key={i} className={i ? "mt-3" : undefined}>
                  {block.input !== null && (
                    <div className="whitespace-pre-wrap text-light-text dark:text-text-primary">
                      <Prompt />
                      {block.input}
                    </div>
                  )}
                  {block.lines.map((line, j) => (
                    <OutputLine key={j} line={line} />
                  ))}
                </div>
              ))}

              <div className="mt-3 flex items-center font-mono text-[13px]">
                <Prompt />
                {/* A label names the field, it does not instruct: the banner above already
                    carries the hint, and it is in the accessibility tree. */}
                <label htmlFor="terminal-input" className="sr-only">
                  Terminal command
                </label>
                <input
                  id="terminal-input"
                  ref={inputRef}
                  value={value}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="help"
                  className="min-w-0 flex-1 bg-transparent text-light-text caret-teal-accent outline-none placeholder:text-light-faint dark:text-text-primary dark:placeholder:text-text-faint"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terminal;
