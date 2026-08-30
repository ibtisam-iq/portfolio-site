// Scrapes the contributions fragment GitHub's own profile page loads, and writes
// src/data/contributions.ts. REFERENCE.md has why this is scraped rather than queried.
//
// The parse proves itself against the heading above the grid, and a failed check keeps the
// previously committed file. The check is a bound, never an equality: the heading and the
// grid do not cover the same window, so they differ by up to a dropped week.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const OUT_FILE = resolve(ROOT, 'src/data/contributions.ts')

const GITHUB_USER = 'ibtisam-iq'
const SOURCE = `https://github.com/users/${GITHUB_USER}/contributions`
const TIMEOUT_MS = 10000

const warn = (msg) => console.log(`  warning: ${msg}`)

// Each day is a <td> carrying its date and shade, with the readable count in a separate
// <tool-tip> further down the document, joined to it by id. Hence two passes and a lookup
// rather than one tidy regex.
function parse(html) {
  const headline = html.match(/<h2[^>]*>\s*([\d,]+)\s*\n?\s*contributions/)
  if (!headline) throw new Error('no contribution headline in the response')
  const headlineTotal = Number(headline[1].replace(/,/g, ''))

  const tips = new Map(
    [...html.matchAll(/<tool-tip[^>]*for="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)<\/tool-tip>/g)]
      .map((m) => [m[1], m[2]])
  )

  const days = [
    ...html.matchAll(
      /data-date="(\d{4}-\d{2}-\d{2})"\s+id="(contribution-day-component-[\d-]+)"\s+data-level="(\d)"/g
    ),
  ]
    .map(([, date, id, level]) => {
      // A day with no contributions has no "N contributions" tooltip to read, which is
      // the only reason a missing match is treated as zero rather than as an error.
      const n = (tips.get(id) ?? '').match(/^([\d,]+) contribution/)
      return { date, level: Number(level), count: n ? Number(n[1].replace(/,/g, '')) : 0 }
    })
    // The cells arrive column by column, one weekday at a time. Sorting by date is what
    // makes the result a timeline instead of seven interleaved ones.
    .sort((a, b) => a.date.localeCompare(b.date))

  if (days.length < 300) throw new Error(`only ${days.length} day cells found, expected about 370`)

  // The total is the sum of the cells, not the heading. The grid is what a reader can see
  // and count, so the figure printed above it has to be the figure it adds up to.
  const summed = days.reduce((n, d) => n + d.count, 0)

  // The heading is still the proof. A grid that parses correctly sums to slightly less than
  // it, never more, and never by much: a dropped week is the largest legitimate gap.
  if (summed > headlineTotal) {
    throw new Error(`days sum to ${summed}, more than the ${headlineTotal} the page prints`)
  }
  if (headlineTotal - summed > headlineTotal * 0.05) {
    throw new Error(
      `days sum to ${summed} against a printed ${headlineTotal}, a gap too large for a ` +
        'calendar boundary, so the counts are not being read correctly'
    )
  }

  return { total: summed, days }
}

function derive({ total, days }) {
  let run = 0
  let longestStreak = 0
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0
    if (run > longestStreak) longestStreak = run
  }

  const busiest = days.reduce((a, b) => (b.count > a.count ? b : a))

  return {
    total,
    start: days[0].date,
    counts: days.map((d) => d.count),
    levels: days.map((d) => d.level),
    activeDays: days.filter((d) => d.count > 0).length,
    longestStreak,
    busiestDay: { date: busiest.date, count: busiest.count },
    measuredAt: new Date().toISOString().slice(0, 10),
  }
}

function previous() {
  if (!existsSync(OUT_FILE)) return null
  const m = readFileSync(OUT_FILE, 'utf8').match(/export const contributions: Contributions = (\{[\s\S]*?\n\})/)
  if (!m) return null
  try {
    return JSON.parse(m[1])
  } catch {
    return null
  }
}

const before = previous()
let data = null

try {
  const res = await fetch(SOURCE, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'User-Agent': 'ibtisam-iq-portfolio-build' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${SOURCE}`)
  data = derive(parse(await res.text()))
} catch (err) {
  warn(err.message)
  if (!before) {
    console.error(
      'generate-contributions failed: the source was unusable and there is no previous\n' +
        '  src/data/contributions.ts to fall back on. Run once with network access to seed it.\n' +
        '  If GitHub has changed its markup, the alternative is the GraphQL\n' +
        '  contributionsCollection query, which needs an authenticated token.'
    )
    process.exit(1)
  }
  warn(`keeping the previous year, measured ${before.measuredAt}`)
  data = before
}

const out = `// ================================================================
// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Source: ${SOURCE}, fetched at build time.
// Regenerate with: npm run generate
// ================================================================

export interface Contributions {
  /** The year's total: the sum of \`counts\`, so the figure matches the grid under it. */
  total: number
  /** Date of the first cell. Always a Sunday: the grid is week-aligned and starts on one. */
  start: string
  /** One entry per day, consecutive from \`start\`. The dates are implied by the index. */
  counts: number[]
  /** GitHub's own 0 to 4 shading, so this agrees with the profile page rather than
   *  inventing its own thresholds. */
  levels: number[]
  /** Days with at least one contribution. */
  activeDays: number
  /** Longest unbroken run of such days. */
  longestStreak: number
  /** The single highest day in the window. */
  busiestDay: { date: string; count: number }
  /** ISO date the numbers were fetched. Quote it; do not imply a live reading. */
  measuredAt: string
}

export const contributions: Contributions = ${JSON.stringify(data, null, 2)}
`

mkdirSync(resolve(ROOT, 'src/data'), { recursive: true })
writeFileSync(OUT_FILE, out)

console.log(
  `  wrote src/data/contributions.ts: ${data.total.toLocaleString('en-US')} contributions over ` +
    `${data.counts.length} days, ${data.activeDays} active, longest streak ${data.longestStreak} ` +
    `(measured ${data.measuredAt})`
)
