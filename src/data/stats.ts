// ================================================================
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
  /** Newest push across every public, non-fork, non-archived repository. `pushedAt` stays
   *  ISO so relative time ages instead of freezing. */
  lastShipped: {
    repo: string
    pushedAt: string
    url: string
  }
  /** ISO date the numbers were fetched. Quote it; do not imply a live reading. */
  measuredAt: string
}

export const stats: Stats = {
  "dockerPulls": 13224,
  "dockerImages": 11,
  "debugboxPulls": 2240,
  "publicRepos": 35,
  "githubStars": 23,
  "starsByRepo": {
    "debugbox": 10,
    "nectar": 5,
    "certification-practice-vault": 3,
    "silver-stack": 3,
    "microservices-demo": 1
  },
  "lastShipped": {
    "repo": "nectar",
    "pushedAt": "2026-09-24T13:19:53Z",
    "url": "https://github.com/ibtisam-iq/nectar/commits"
  },
  "measuredAt": "2026-09-26"
}

/** 10882 renders as "10,882". Kept here so every surface formats it the same way. */
export const formatCount = (n: number): string => n.toLocaleString("en-US")
