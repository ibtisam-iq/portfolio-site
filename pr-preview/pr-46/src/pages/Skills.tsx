// The tools page: every technology a published project uses, grouped by domain.

import { useState, useMemo, useRef, useEffect } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { StatBand, StatFigure } from "../components/StatFigure";
import { source } from "../lib/provenance";
import { monogram, hueOf, distinctiveName } from "../lib/monogram";
import { stats } from "../data/stats";
import {
  categories,
  toolProjects,
  trainedTools,
  projectUrl,
  keywordTechnologies,
  EVIDENCED_COUNT,
  TRAINED_COUNT,
  TOTAL_TOOLS,
} from "../data/generated";

/**
 * A category rail, one category of tiles at a time, and a selected tool's projects opening
 * in place, so seventy-one items never appear at once. `All` is not the landing state.
 * The rule this page keeps: nothing on it claims a tool without a project behind it.
 */

const certBadges: Record<string, string> = {
  Kubernetes: "CKA + CKAD",
  kubeadm: "CKA",
  Helm: "CKAD",
  Kustomize: "CKAD",
};

const ALL = "All";

/** 17 tools, all 17 evidenced, and the subject of both certifications. */
const DEFAULT_CATEGORY = "Containers & Orchestration";

const Skills = () => {
  useDocumentTitle("Engineering Stack");
  const [active, setActive] = useState(DEFAULT_CATEGORY);
  const [search, setSearch] = useState("");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const query = search.trim().toLowerCase();
  const matches = (name: string) => !query || name.toLowerCase().includes(query);

  /** Match counts per category, recomputed against the search rather than fixed, so the
   *  rail keeps showing where the matches are while a query is active. */
  const counts = useMemo(() => {
    const perCategory = Object.fromEntries(
      categories.map((c) => [c.title, c.tools.filter((t) => matches(t.name)).length])
    );
    return {
      ...perCategory,
      [ALL]: Object.values(perCategory).reduce((a, b) => a + b, 0),
    } as Record<string, number>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  /**
   * The one place the grid's order is decided: count, then `distinctiveName` so a vendor
   * prefix never leads, then the full name so ties cannot reorder between builds.
   */
  const projectCount = (name: string) => toolProjects[name]?.length ?? 0;

  const visible = useMemo(() => {
    const base = active === ALL ? categories : categories.filter((c) => c.title === active);
    return base
      .flatMap((c) =>
        c.tools.filter((t) => matches(t.name)).map((t) => ({ ...t, category: c.title }))
      )
      .sort(
        (a, b) =>
          projectCount(b.name) - projectCount(a.name) ||
          distinctiveName(a.name).localeCompare(distinctiveName(b.name)) ||
          a.name.localeCompare(b.name)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, query]);

  const selectable = (name: string) => Boolean(toolProjects[name] || trainedTools[name]);

  const onToolClick = (name: string) => {
    if (!selectable(name)) return;
    setSelectedTool(selectedTool === name ? null : name);
  };

  // On a narrow screen the detail renders above the grid, so opening one without moving the
  // viewport would put the answer off-screen behind the reader. On lg it is already beside
  // the grid and in view, and `nearest` correctly does nothing there.
  useEffect(() => {
    if (selectedTool) detailRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedTool]);

  const railItems = [{ title: ALL }, ...categories.map((c) => ({ title: c.title }))];

  // Scaled against the largest category rather than against All, because All is the union
  // of the others rather than a seventh peer: including it would squash every real bar to
  // under a quarter of the track and show the shape of nothing.
  const largestCategory = Math.max(...categories.map((c) => c.tools.length));

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
        }}
        aria-hidden="false"
      >
        <h1>Engineering Stack | Muhammad Ibtisam Iqbal, DevOps &amp; Cloud Engineer</h1>
        {/* Every technology any project uses, showcased or not, generated from the
            taxonomy. Recruiter tooling matches the application layer here without it
            occupying the visible page. */}
        <p>
          {keywordTechnologies.join(", ")}. CKA, CKAD, CI/CD pipelines,
          infrastructure automation, DevSecOps, GitOps, platform engineering.
        </p>
      </div>

      <div className="section-y text-light-text dark:text-text-primary">
        <div className="page-frame">
          <div className="mb-10">
            <p className="eyebrow">Engineering Stack</p>
            <h1 className="title-page">
              Tools I{" "}
              <span className="text-teal-accent">
                Actually Use
              </span>
            </h1>

            <div className="mt-8">
              <StatBand>
                <StatFigure
                  value={String(TOTAL_TOOLS)}
                  label="tools"
                  sub="on this page"
                  title={source("projects.ibtisam-iq.com", stats.measuredAt)}
                />
                <StatFigure
                  value={String(EVIDENCED_COUNT)}
                  label="used in a project"
                  sub="source and a runbook"
                  href="https://projects.ibtisam-iq.com"
                  title={source(
                    "projects.ibtisam-iq.com",
                    stats.measuredAt,
                    `${EVIDENCED_COUNT} of ${TOTAL_TOOLS}`
                  )}
                />
                <StatFigure
                  value={String(TRAINED_COUNT)}
                  label="from training only"
                  sub="labelled as such"
                  title={source("projects.ibtisam-iq.com", stats.measuredAt, "no project uses them")}
                />
                {/* No qualifier: naming the source already says whose taxonomy it is. The
                    others survive because each adds a fact. */}
                <StatFigure
                  value={String(categories.length)}
                  label="categories"
                  sub="by domain"
                  title={source("projects.ibtisam-iq.com", stats.measuredAt)}
                />
              </StatBand>
            </div>

            {/* The one place the tier is explained. The band above already carries both
                counts with their provenance, and each tile's dot carries its tier. */}
            <p className="mt-6 max-w-2xl text-lg text-light-muted dark:text-text-muted">
              Pick a tool to see{" "}
              <a
                href="https://projects.ibtisam-iq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-accent transition-colors hover:text-teal-accent/80"
              >
                the projects that use it
              </a>
              . A green dot means a project uses it; amber means training only.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[276px_minmax(0,1fr)] lg:gap-10">
            {/* Rail and detail, sticky as one unit, so selecting a tool never moves the
                grid beside it. */}

            {/* `min-w-0`: a grid item defaults to `min-width:auto`, so without it the widest
                category name sets this column's floor and overflows the page at 375. */}
            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              {/* One panel for the whole control, so the controls and the tiles do not
                  share a shape and stop reading as hierarchy. */}
              <div className="panel p-3">
              <label className="sr-only" htmlFor="tool-search">
                Search tools
              </label>
              <input
                id="tool-search"
                type="search"
                placeholder={`Search ${TOTAL_TOOLS} tools`}
                value={search}
                onChange={(e) => {
                  const next = e.target.value;
                  setSearch(next);
                  setSelectedTool(null);
                  // Widen to All when this category has nothing for the query but another
                  // does, or the grid reports an empty state the rail beside it contradicts.
                  // Search is a global intent.
                  const q = next.trim().toLowerCase();
                  if (q && active !== ALL) {
                    const here = categories.find((c) => c.title === active);
                    const hereHas = here?.tools.some((t) => t.name.toLowerCase().includes(q));
                    const anywhere = categories.some((c) =>
                      c.tools.some((t) => t.name.toLowerCase().includes(q))
                    );
                    if (!hereHas && anywhere) setActive(ALL);
                  }
                }}
                className="well well-edge w-full px-3.5 py-2.5 text-sm text-light-text placeholder:text-light-faint focus:outline-none focus:ring-2 focus:ring-teal-accent/40 dark:text-text-primary dark:placeholder:text-text-faint"
              />

              <div className="my-3.5 h-px bg-light-border dark:bg-border-subtle" />

              <div
                role="tablist"
                aria-label="Tool categories"
                className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
              >
                {railItems.map((item) => {
                  const isActive = active === item.title;
                  const count = counts[item.title] ?? 0;
                  const empty = count === 0;
                  return (
                    <button
                      key={item.title}
                      role="tab"
                      aria-selected={isActive}
                      disabled={empty}
                      onClick={() => {
                        setActive(item.title);
                        setSelectedTool(null);
                      }}
                      /*
                       * A quiet accent surface with a 2px leading bar, never a solid fill:
                       * that treatment already means "act on this" on the Contact button
                       * and the hero's primary action.
                       */
                      className={`relative flex shrink-0 items-center justify-between gap-2.5 overflow-hidden rounded-lg px-3 py-2.5 text-left text-sm transition-colors lg:w-full ${
                        isActive
                          ? "bg-teal-accent/[0.08] font-semibold text-teal-accent before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:rounded-full before:bg-teal-accent before:content-['']"
                          : empty
                            ? "cursor-not-allowed text-light-faint dark:text-text-faint"
                            : "text-light-muted hover:bg-light-surface-2 hover:text-light-text dark:text-text-muted dark:hover:bg-surface-2 dark:hover:text-white"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      <span
                        className={`font-mono text-[11px] tabular-nums ${
                          isActive
                            ? "text-teal-accent/70"
                            : "text-light-faint dark:text-text-faint"
                        }`}
                      >
                        {count}
                      </span>
                      {/* A proportion bar under the count. `bg-current` so one rule works
                          on every row, inset past the 2px active bar. Categories only: All
                          is their union, not a seventh peer. */}
                      {item.title !== ALL && (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute bottom-[5px] left-3 h-0.5 rounded-full bg-current opacity-40"
                          style={{
                            width: `calc((100% - 1.5rem) * ${
                              (counts[item.title] ?? 0) / largestCategory
                            })`,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              </div>

              <div ref={detailRef}>
                {selectedTool && <Detail name={selectedTool} onClose={() => setSelectedTool(null)} />}
              </div>
            </div>

            {/* The grid. min-w-0 for the same reason as the rail above. */}
            <div className="min-w-0">
              {visible.length === 0 ? (
                <p className="py-16 text-center text-light-muted dark:text-text-muted">
                  No tools match &ldquo;{search}&rdquo;
                </p>
              ) : (
                <div
                  key={`${active}|${query}`}
                  className="animate-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {visible.map((tool) => (
                    <Tile
                      key={`${tool.category}-${tool.name}`}
                      name={tool.name}
                      selected={selectedTool === tool.name}
                      onClick={() => onToolClick(tool.name)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Tile = ({
  name,
  selected,
  onClick,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
}) => {
  const projects = toolProjects[name];
  const trained = !projects && Boolean(trainedTools[name]);
  const cert = certBadges[name];

  return (
    <button
      onClick={onClick}
      aria-expanded={selected}
      aria-label={
        projects
          ? `${name}, used in ${projects.length} project${projects.length !== 1 ? "s" : ""}`
          : `${name}, known from training, no project uses it yet`
      }
      className={`panel flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors ${
        selected
          ? "beam border-teal-accent/60 dark:border-teal-accent/50"
          : "panel-link"
      }`}
    >
      <span
        aria-hidden="true"
        className="mark h-9 w-9 text-[11px]"
        style={{ "--mark-hue": hueOf(name) } as React.CSSProperties}
      >
        {monogram(name)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{name}</span>
        {/* nowrap: the tile is a fixed grid cell and a certification badge eats into it, so
            "5 projects" broke across two lines on the one tile that has both. The count is
            two words and should stay two words; the name above it is what truncates. */}
        <span className="mt-0.5 flex items-center gap-2 whitespace-nowrap font-mono text-[11px] text-light-faint dark:text-text-faint">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              trained ? "bg-amber-500 dark:bg-amber-400" : "bg-green-600 dark:bg-green-400"
            }`}
          />
          {projects
            ? `${projects.length} project${projects.length !== 1 ? "s" : ""}`
            : "training"}
        </span>
      </span>

      {cert && (
        <span className="shrink-0 rounded bg-teal-accent/15 px-1.5 py-0.5 text-[10px] font-bold leading-none text-teal-accent">
          {cert}
        </span>
      )}
    </button>
  );
};

const Detail = ({ name, onClose }: { name: string; onClose: () => void }) => {
  const projects = toolProjects[name];
  const note = trainedTools[name];

  return (
    <div
      className={`panel glow mt-4 p-4 ${
        projects
          ? "border-teal-accent/30 dark:border-teal-accent/20"
          : "border-amber-500/30 dark:border-amber-400/20"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="mt-0.5 text-xs text-light-muted dark:text-text-muted">
            {projects
              ? `Used in ${projects.length} project${projects.length !== 1 ? "s" : ""}`
              : "No published project uses it"}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label={`Close ${name} details`}
          className="-mr-1 -mt-1 shrink-0 rounded-md p-1 text-light-muted transition-colors hover:text-light-text dark:text-text-faint dark:hover:text-text-primary"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </div>

      {projects ? (
        <div className="flex flex-wrap gap-2">
          {projects.map((project) => (
            <a
              key={project.slug}
              href={projectUrl(project.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-light-border bg-light-surface px-2.5 py-1.5 text-xs font-medium text-light-text transition-colors hover:border-teal-accent/50 hover:text-teal-accent dark:border-border-subtle dark:bg-surface-1 dark:text-text-primary dark:hover:border-teal-accent/30 dark:hover:text-teal-accent"
            >
              {project.name}
              <span aria-hidden="true">&#8599;</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-xs text-light-muted dark:text-text-muted">{note}</p>
      )}
    </div>
  );
};

export default Skills;
