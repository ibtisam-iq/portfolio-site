// Fetches the Docker Hub and GitHub counts at build time and writes src/data/stats.ts.
// Build time is forced: Docker Hub sends no CORS header at all, and GitHub rate-limits
// unauthenticated callers per IP. See REFERENCE.md.

// It never fails the build. An unreachable endpoint keeps the previously committed values
// and prints a warning; `measuredAt` is what keeps the page honest about freshness.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const OUT_FILE = resolve(ROOT, 'src/data/stats.ts')

const DOCKER_NAMESPACE = 'mibtisam'
const GITHUB_USER = 'ibtisam-iq'

// Every public repository, never a curated list: the site says "most recent push", and a
// chosen subset makes that false. Forks and archived repositories are excluded, which is
// not curation: a fork's `pushed_at` moves without a commit.
const eligibleForShipping = (r) => !r.fork && !r.archived && !r.private

// How many of the top-starred repos to record individually. The total is summed across
// every public repo regardless.
const TOP_STARRED_COUNT = 5

const TIMEOUT_MS = 10000

const warn = (msg) => console.log(`  warning: ${msg}`)

// GITHUB_TOKEN when set, because runners share IPs against a 60-per-hour anonymous limit.
// Absent locally, which is fine.
const githubHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'ibtisam-iq-portfolio-build',
  }
  const token = process.env.GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function getJson(url) {
  const isGithub = url.startsWith('https://api.github.com/')
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: isGithub
      ? githubHeaders()
      : { Accept: 'application/json', 'User-Agent': 'ibtisam-iq-portfolio-build' },
  })
  if (!res.ok) {
    const remaining = res.headers.get('x-ratelimit-remaining')
    const hint = remaining === '0' ? ' (GitHub rate limit exhausted for this IP)' : ''
    throw new Error(`HTTP ${res.status} from ${url}${hint}`)
  }
  return res.json()
}

// Reads the previous run's numbers out of the committed file, so an outage degrades to
// "slightly stale" instead of "zero".
function previousStats() {
  if (!existsSync(OUT_FILE)) return null
  const m = readFileSync(OUT_FILE, 'utf8').match(/export const stats: Stats = (\{[\s\S]*?\n\})/)
  if (!m) return null
  try {
    return JSON.parse(m[1])
  } catch {
    return null
  }
}

// Docker Hub paginates at 100. The namespace holds 11 repositories, so one page is
// enough today, but the loop means a twelfth does not silently drop out of the total.
async function fetchDockerPulls() {
  let url = `https://hub.docker.com/v2/repositories/${DOCKER_NAMESPACE}/?page_size=100`
  let total = 0
  let images = 0
  let debugbox = null

  while (url) {
    const page = await getJson(url)
    for (const repo of page.results ?? []) {
      total += repo.pull_count ?? 0
      images += 1
      if (repo.name === 'debugbox') debugbox = repo.pull_count ?? 0
    }
    url = page.next
  }

  if (images === 0) throw new Error('Docker Hub returned no repositories')
  return { dockerPulls: total, dockerImages: images, debugboxPulls: debugbox }
}

// One paginated pass over every public repository answers all three questions. Fetching
// named repositories individually can only count what it was told to look at, which
// under-reported the star total by a third.
async function fetchGithub() {
  const user = await getJson(`https://api.github.com/users/${GITHUB_USER}`)

  const repos = []
  for (let page = 1; page <= 10; page++) {
    const batch = await getJson(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner&page=${page}`
    )
    repos.push(...batch)
    if (batch.length < 100) break
  }

  if (repos.length === 0) throw new Error('GitHub returned no public repositories')

  const githubStars = repos.reduce((n, r) => n + (r.stargazers_count ?? 0), 0)

  const starsByRepo = Object.fromEntries(
    repos
      .filter((r) => (r.stargazers_count ?? 0) > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, TOP_STARRED_COUNT)
      .map((r) => [r.name, r.stargazers_count])
  )

  const shipped = repos
    .filter(eligibleForShipping)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))

  if (shipped.length === 0) {
    throw new Error('no public non-fork repo found, so no last-shipped')
  }

  const latest = shipped[0]

  return {
    publicRepos: user.public_repos ?? 0,
    githubStars,
    starsByRepo,
    lastShipped: {
      repo: latest.name,
      pushedAt: latest.pushed_at,
      url: `${latest.html_url}/commits`,
    },
  }
}

const previous = previousStats()
let stats = null

try {
  const [docker, github] = await Promise.all([fetchDockerPulls(), fetchGithub()])
  // The date is the point of the file, so it is stamped from the run that measured.
  stats = { ...docker, ...github, measuredAt: new Date().toISOString().slice(0, 10) }
} catch (err) {
  warn(err.message)
  if (!previous) {
    console.error(
      'generate-stats failed: no reachable API and no previous src/data/stats.ts to fall back on.\n' +
        '  Run this once with network access to seed the file.'
    )
    process.exit(1)
  }
  warn(`keeping previous numbers, measured ${previous.measuredAt}`)
  stats = previous
}

// Fall back wholesale, never per field: these counts only climb, and patching one leaves
// it beside a fresh value for another.
if (previous && stats !== previous) {
  const regressed = ['dockerPulls', 'publicRepos', 'githubStars'].filter(
    (k) => stats[k] === 0 && previous[k] > 0
  )
  if (regressed.length) {
    warn(`${regressed.join(', ')} came back 0 after being nonzero, which these counts do not do`)
    warn(`discarding this reading, keeping the set measured ${previous.measuredAt}`)
    stats = previous
  }
}

const out = `// ================================================================
// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Sources: hub.docker.com/v2 and api.github.com, fetched at build time.
// Regenerate with: npm run generate
// ================================================================

export interface Stats {
  /** Pulls summed across every image in the Docker Hub namespace. */
  dockerPulls: number
  /** How many images that total covers. */
  dockerImages: number
  /** Pulls for the DebugBox image alone. */
  debugboxPulls: number
  /** Public repositories on the GitHub account. */
  publicRepos: number
  /** Stars summed across every public repository on the account. */
  githubStars: number
  /** The most-starred public repositories, highest first. */
  starsByRepo: Record<string, number>
  /** Newest push across every public, non-fork, non-archived repository. \`pushedAt\` stays
   *  ISO so relative time ages instead of freezing. */
  lastShipped: {
    repo: string
    pushedAt: string
    url: string
  }
  /** ISO date the numbers were fetched. Quote it; do not imply a live reading. */
  measuredAt: string
}

export const stats: Stats = ${JSON.stringify(stats, null, 2)}

/** 10882 renders as "10,882". Kept here so every surface formats it the same way. */
export const formatCount = (n: number): string => n.toLocaleString("en-US")
`

mkdirSync(resolve(ROOT, 'src/data'), { recursive: true })
writeFileSync(OUT_FILE, out)

console.log(
  `  wrote src/data/stats.ts: ${stats.dockerPulls.toLocaleString('en-US')} pulls across ` +
    `${stats.dockerImages} images, ${stats.githubStars} stars, ${stats.publicRepos} public repos ` +
    `(measured ${stats.measuredAt})`
)
console.log(
  `  last shipped: ${stats.lastShipped.repo} at ${stats.lastShipped.pushedAt} ` +
    `(newest push across every public non-fork repo)`
)
