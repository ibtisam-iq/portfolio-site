// ================================================================
// The command table behind the homepage terminal.
//
// This file contains no facts. Every figure it prints is read out of a generated
// module at render time, so the terminal cannot drift from the rest of the site and
// cannot be "updated" by editing a string here.
// ================================================================

import {
  PROJECT_COUNT,
  PROJECTS_URL,
  TOTAL_TOOLS,
  TECH_COUNT,
  EVIDENCED_COUNT,
  TRAINED_COUNT,
  HIDDEN_TECH_COUNT,
  categories,
  featuredProjects,
  toolProjects,
  evidenceKind,
  trainedTools,
} from "./generated";
import { stats, formatCount } from "./stats";
import { contributions } from "./contributions";
import { variants, comparison, REDUCTION_PCT, REPO_URL, DOCS_URL } from "./debugbox";
import { availability } from "./availability";

/**
 * Dates here are ISO 8601, not the site's human format. Machine output gets machine dates;
 * the register is the point of the component.
 */

/**
 * The rule this file exists to enforce: no command simulates infrastructure. Nothing scans,
 * connects or returns a cluster. Every command reports something already published
 * elsewhere on this site. See REFERENCE.md.
 */

export type Tone = "out" | "accent" | "dim" | "err" | "head";

export interface Line {
  text: string
  tone?: Tone
  /** Renders the line as a link. External only; the terminal never routes. */
  href?: string
  /** Leading monospace columns, as a count rather than spaces in `text`: an anchor's
   *  leading whitespace collapses, and hover should underline the URL, not the gap. */
  indent?: number
}

export interface Command {
  name: string
  /** Shown by `help`. Includes the argument when one is accepted. */
  usage: string
  summary: string
  /** Everything after the command name, trimmed. Empty string when there is none. */
  run: (arg: string) => Line[]
}

const out = (text: string): Line => ({ text })
const dim = (text: string): Line => ({ text, tone: "dim" })
const head = (text: string): Line => ({ text, tone: "head" })
const err = (text: string): Line => ({ text, tone: "err" })
const link = (text: string, href: string, indent = 0): Line => ({
  text,
  tone: "accent",
  href,
  indent,
})
const blank = (): Line => ({ text: "" })

/** Pads a label so a column of them lines up in a monospace face. */
const row = (label: string, value: string, width = 18): Line =>
  out(`${label.padEnd(width)}${value}`)

const EMAIL = "contact@ibtisam-iq.com"

/** Every tool name the site publishes: the tools page, the evidence map, and the
 *  trained tier. Deduplicated, and sorted so `tools <prefix>` is deterministic. */
const SEARCHABLE: string[] = [
  ...new Set([
    ...categories.flatMap((c) => c.tools.map((t) => t.name)),
    ...Object.keys(toolProjects),
    ...Object.keys(trainedTools),
  ]),
].sort()

const commands: Command[] = [
  {
    name: "whoami",
    usage: "whoami",
    summary: "identity, certifications and availability",
    run: () => [
      row("name", "Muhammad Ibtisam Iqbal"),
      row("role", "DevOps and Cloud Engineer"),
      row("certifications", "CKA, CKAD"),
      row("based", "Islamabad, Pakistan"),
      availability.open
        ? { text: `${"status".padEnd(18)}${availability.headline}`, tone: "accent" }
        : row("status", "not currently looking"),
      availability.open ? dim(`${"".padEnd(18)}${availability.detail}`) : blank(),
      blank(),
      dim(`availability confirmed by hand, ${availability.checkedOn}`),
    ],
  },
  {
    name: "stats",
    usage: "stats",
    summary: "the numbers, and who counted them",
    run: () => [
      head("counted by Docker Hub and GitHub"),
      row("docker pulls", `${formatCount(stats.dockerPulls)} across ${stats.dockerImages} images`),
      row("contributions", `${formatCount(contributions.total)} in the last year`),
      row("public repos", String(stats.publicRepos)),
      row("stars", String(stats.githubStars)),
      blank(),
      head("counted by this site, from projects.yaml"),
      row("projects", String(PROJECT_COUNT)),
      row("tools listed", `${TOTAL_TOOLS} (${EVIDENCED_COUNT} evidenced, ${TRAINED_COUNT} trained)`),
      row("tech entries", `${TECH_COUNT}, ${HIDDEN_TECH_COUNT} not shown on the tools page`),
    ],
  },
  {
    name: "projects",
    usage: "projects",
    summary: `all ${PROJECT_COUNT} projects, with links`,
    run: () => [
      head(`${PROJECT_COUNT} projects, each with a public repo`),
      ...featuredProjects.flatMap((p, i) => [
        out(`${String(i + 1).padStart(2, "0")}  ${p.title}`),
        dim(`    ${p.tech.join(", ")}`),
        link(p.url, p.url, 4),
      ]),
      blank(),
      link(PROJECTS_URL, PROJECTS_URL),
    ],
  },
  {
    name: "tools",
    usage: "tools [name]",
    summary: "the stack, or which projects use one tool",
    run: (arg) => {
      if (!arg) {
        return [
          head(`${TOTAL_TOOLS} tools across ${categories.length} domains`),
          ...categories.map((c) =>
            out(`${String(c.tools.length).padStart(2)}  ${c.title}`)
          ),
          blank(),
          dim(`try: tools kubernetes`),
        ]
      }

      const needle = arg.toLowerCase()
      // Every name the site publishes, not only the evidenced ones. The tiers govern how a
      // tool may be cited, never whether it exists.
      const names = SEARCHABLE
      const match =
        names.find((n) => n.toLowerCase() === needle) ??
        names.find((n) => n.toLowerCase().includes(needle))

      if (!match) {
        const near = names.filter((n) => n.toLowerCase().includes(needle.slice(0, 4)))
        return [
          err(`no tool matching "${arg}"`),
          ...(near.length ? [dim(`closest: ${near.slice(0, 6).join(", ")}`)] : []),
          dim("run `tools` for the six domains"),
        ]
      }

      const note = trainedTools[match]
      if (note) {
        return [
          head(match),
          err("trained, not evidenced by any project here"),
          dim(note),
        ]
      }

      const used = toolProjects[match] ?? []
      if (!used.length) {
        return [head(match), out("listed on the tools page, no project cited")]
      }

      const kind = evidenceKind[match]
      return [
        head(match),
        out(
          kind === "tech"
            ? `used in ${used.length} of ${PROJECT_COUNT} projects`
            : `evidenced by ${used.length} project${used.length === 1 ? "" : "s"} (${kind} match)`
        ),
        ...used.map((p) => link(p.name, `${PROJECTS_URL}/${p.slug}`, 2)),
      ]
    },
  },
  {
    name: "debugbox",
    usage: "debugbox",
    summary: "the Kubernetes debug image, three variants",
    run: () => [
      head("debugbox, an open-source kubectl-debug image"),
      ...variants.map((v) =>
        out(`${v.label.padEnd(10)}${String(v.sizeMB).padStart(3)} MB   ${v.tagline}`)
      ),
      blank(),
      out(
        `${REDUCTION_PCT}% smaller than ${comparison.label} (${comparison.sizeMB} MB)`
      ),
      row("pulls", formatCount(stats.debugboxPulls)),
      ...(stats.starsByRepo.debugbox
        ? [row("stars", String(stats.starsByRepo.debugbox))]
        : []),
      blank(),
      link(REPO_URL, REPO_URL),
      link(DOCS_URL, DOCS_URL),
    ],
  },
  {
    name: "contributions",
    usage: "contributions",
    summary: "the last year on GitHub",
    run: () => [
      head(`${formatCount(contributions.total)} contributions since ${contributions.start}`),
      row("active days", `${contributions.activeDays} of ${contributions.counts.length}`),
      row("longest streak", `${contributions.longestStreak} days`),
      row("busiest day", `${contributions.busiestDay.date}, ${contributions.busiestDay.count}`),
      blank(),
      dim("the full grid is on the about page"),
      dim(`read from GitHub at build time, ${contributions.measuredAt}`),
    ],
  },
  {
    name: "contact",
    usage: "contact",
    summary: "email and profile links",
    run: () => [
      link(EMAIL, `mailto:${EMAIL}`),
      link("linkedin.com/in/ibtisam-iq", "https://linkedin.com/in/ibtisam-iq"),
      link("github.com/ibtisam-iq", "https://github.com/ibtisam-iq"),
      ...(availability.open
        ? [blank(), { text: availability.headline, tone: "accent" as Tone }]
        : []),
    ],
  },
]

export const COMMANDS = commands
export const COMMAND_NAMES = commands.map((c) => c.name)

const helpLines = (): Line[] => [
  head("commands"),
  ...commands.map((c) => out(`  ${c.usage.padEnd(16)}${c.summary}`)),
  out(`  ${"clear".padEnd(16)}empty the scrollback`),
  blank(),
  dim("nothing here connects to a cluster, and nothing simulates one."),
]

export interface Result {
  lines: Line[]
  /** `clear` is the one command that acts on the terminal rather than printing. */
  clear?: boolean
}

/** Parses one line of input and returns what to print. Pure; the component holds state. */
export const execute = (input: string): Result => {
  const trimmed = input.trim()
  if (!trimmed) return { lines: [] }

  const [word, ...rest] = trimmed.split(/\s+/)
  const name = word.toLowerCase()
  const arg = rest.join(" ")

  if (name === "clear") return { lines: [], clear: true }
  if (name === "help" || name === "?") return { lines: helpLines() }

  const command = commands.find((c) => c.name === name)
  if (command) return { lines: command.run(arg) }

  // Deliberately not a guess. An unknown command is answered with the actual command
  // list, because inventing a plausible response is the exact failure this file exists
  // to avoid, and because a reader who mistyped needs the list more than an apology.
  return {
    lines: [
      err(`${word}: not a command here`),
      dim(`available: ${COMMAND_NAMES.join(", ")}, help, clear`),
    ],
  }
}

// Two lines, because the panel already carries the host in its title bar and the date
// above it, and because everything here shares a 244px box with a worked example.
export const BANNER: Line[] = [dim("type help to see the commands.")]
