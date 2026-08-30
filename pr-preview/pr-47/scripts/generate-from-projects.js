// Derives the site's project and tool data from https://github.com/ibtisam-iq/projects,
// reading data/projects.yaml and src/data/taxonomy.ts there, and writing
// src/data/generated.ts. Runs from `prebuild` and `predev`.

// A sibling clone at ../projects wins when present; PROJECTS_YAML_SOURCE=remote forces the
// fetch. No project is named here: short names and the homepage flag are YAML fields, so
// adding a project upstream needs no edit in this repository.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { parse } from 'yaml'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

const LOCAL_YAML = resolve(ROOT, '../projects/data/projects.yaml')
const REMOTE_YAML =
  'https://raw.githubusercontent.com/ibtisam-iq/projects/main/data/projects.yaml'

const LOCAL_TAXONOMY = resolve(ROOT, '../projects/src/data/taxonomy.ts')
const REMOTE_TAXONOMY =
  'https://raw.githubusercontent.com/ibtisam-iq/projects/main/src/data/taxonomy.ts'

const OUT_FILE = resolve(ROOT, 'src/data/generated.ts')
const PROJECTS_URL = 'https://projects.ibtisam-iq.com'




// Tools known from training that no published project demonstrates, never presented as
// though a project backed them. Listing them here also separates "correctly has no
// project" from "the alias is misspelled", and a tool that later gains one is reported.

// Add an entry only for something actually used or studied: the evidenced tier is the
// site's whole argument, and one unfounded claim here discredits it.
const TRAINED_TOOLS = {
  Ansible: {
    domain: 'cloud-iac',
    note: 'From the DevOps Shack bootcamp and KodeKloud labs. Terraform is the evidenced infrastructure-as-code tool.',
  },
  'RHEL / CentOS': {
    domain: 'runtimes-data',
    note: 'From the Technical Guftgu Linux course. Ubuntu and Alpine are the evidenced distributions.',
  },
}


const fail = (lines) => {
  console.error('generate-from-projects failed:\n' + lines.map((l) => '  - ' + l).join('\n'))
  process.exit(1)
}

async function loadYaml() {
  const forceRemote = process.env.PROJECTS_YAML_SOURCE === 'remote'

  if (!forceRemote && existsSync(LOCAL_YAML)) {
    console.log(`  source: ${LOCAL_YAML} (local sibling)`)
    return readFileSync(LOCAL_YAML, 'utf8')
  }

  console.log(`  source: ${REMOTE_YAML}`)
  const res = await fetch(REMOTE_YAML)
  if (!res.ok) {
    fail([
      `fetching projects.yaml returned HTTP ${res.status}`,
      'clone github.com/ibtisam-iq/projects next to this repo to build offline',
    ])
  }
  return res.text()
}

async function loadTaxonomy() {
  const forceRemote = process.env.PROJECTS_YAML_SOURCE === 'remote'

  if (!forceRemote && existsSync(LOCAL_TAXONOMY)) {
    console.log(`  taxonomy: ${LOCAL_TAXONOMY} (local sibling)`)
    return readFileSync(LOCAL_TAXONOMY, 'utf8')
  }

  console.log(`  taxonomy: ${REMOTE_TAXONOMY}`)
  const res = await fetch(REMOTE_TAXONOMY)
  if (!res.ok) {
    fail([
      `fetching taxonomy.ts returned HTTP ${res.status}`,
      'clone github.com/ibtisam-iq/projects next to this repo to build offline',
    ])
  }
  return res.text()
}

// taxonomy.ts is TypeScript, so it is read as text rather than imported: pulling it
// through a TS loader here would make this generator depend on the very build step it
// runs before, and it lives in a different repository besides.
function parseTaxonomy(src) {
  const domains = [...src.matchAll(/id:\s*"([a-z-]+)"[\s\S]{0,120}?label:\s*"([^"]+)"/g)].map(
    (m) => ({ id: m[1], label: m[2] })
  )
  if (domains.length === 0) fail(['no DOMAINS entries found in taxonomy.ts'])

  const start = src.indexOf('TECH_REGISTRY')
  if (start === -1) fail(['no TECH_REGISTRY found in taxonomy.ts'])
  const block = src.slice(start, src.indexOf('\n}', start))

  const entries = [...block.matchAll(
    /^\s*(?:"([^"]+)"|([A-Za-z_][\w]*))\s*:\s*\{\s*domain:\s*"([a-z-]+)"\s*,\s*showcase:\s*(true|false)\s*\}/gm
  )].map((m) => ({
    name: m[1] ?? m[2],
    domain: m[3],
    showcase: m[4] === 'true',
  }))

  if (entries.length === 0) {
    fail([
      'TECH_REGISTRY has no { domain, showcase } entries.',
      'The projects repo still has the old Record<string, DomainId> shape on this branch.',
      'Merge the taxonomy change to main, or build against a local sibling clone.',
    ])
  }
  return { domains, entries }
}

const yamlText = await loadYaml()
const taxonomyText = await loadTaxonomy()
const projects = parse(yamlText)

if (!Array.isArray(projects) || projects.length === 0) {
  fail(['projects.yaml did not parse into a non-empty array'])
}

// --- validate the fields the UI depends on -------------------------------------------

// Validated upstream too, but checked again here because that repository cannot catch one
// case: an older projects.yaml fetched from a branch predating these fields.
const errors = []
for (const p of projects) {
  if (!p.slug) errors.push(`a project entry has no slug (title: ${p.title ?? 'unknown'})`)
  if (typeof p.shortName !== 'string' || !p.shortName.trim()) {
    errors.push(`project "${p.slug}" has no shortName in projects.yaml`)
  }
  if (typeof p.homepage !== 'boolean') {
    errors.push(`project "${p.slug}" has no homepage boolean in projects.yaml`)
  }
}
if (errors.length) {
  fail([
    ...errors,
    'shortName and homepage are set in data/projects.yaml in the projects repository:',
    'https://github.com/ibtisam-iq/projects/blob/main/data/projects.yaml',
    'If they are missing, that repository is behind: merge the change adding them to main.',
  ])
}

// --- build the tool to project map --------------------------------------------------

const displayOf = (slug) => projects.find((p) => p.slug === slug).shortName

const refOf = (p) => ({ name: displayOf(p.slug), slug: p.slug })

// canonical taxonomy name -> [{ name, slug }], in projects.yaml order
const byTech = new Map()
for (const p of projects) {
  for (const tech of p.tech ?? []) {
    if (!byTech.has(tech)) byTech.set(tech, [])
    byTech.get(tech).push(refOf(p))
  }
}

const taxonomy = parseTaxonomy(taxonomyText)

// Only technologies a project actually uses can appear. A registry entry nothing uses
// is a name reserved for later, not a claim, so it is skipped rather than shown.
const showcased = taxonomy.entries.filter((e) => e.showcase && byTech.has(e.name))

const toolProjects = {}
const evidenceKind = {}

for (const entry of showcased) {
  toolProjects[entry.name] = byTech.get(entry.name)
  evidenceKind[entry.name] = 'tech'
}

// A trained tool that a project turns out to use is no longer trained, and leaving it
// in both places would double-count it against the tier totals.
const nowHasProject = Object.keys(TRAINED_TOOLS).filter((t) => t in toolProjects)
if (nowHasProject.length) {
  console.log(
    `  note: now evidenced by a project, remove from TRAINED_TOOLS: ${nowHasProject.join(', ')}`
  )
}
const trainedTools = Object.fromEntries(
  Object.entries(TRAINED_TOOLS)
    .filter(([t]) => !(t in toolProjects))
    .map(([t, meta]) => [t, meta.note])
)

// --- group into the taxonomy's own domains -------------------------------------------

const domainLabels = new Map(taxonomy.domains.map((d) => [d.id, d.label]))

const trainedDomain = {}
for (const [name, meta] of Object.entries(TRAINED_TOOLS)) {
  if (!domainLabels.has(meta.domain)) {
    fail([`TRAINED_TOOLS "${name}" has domain "${meta.domain}", which is not a taxonomy domain`])
  }
  trainedDomain[name] = meta.domain
}

const domainOf = (name) => {
  const entry = taxonomy.entries.find((e) => e.name === name)
  if (entry) return entry.domain
  return trainedDomain[name]
}

const allToolNames = [...Object.keys(toolProjects), ...Object.keys(trainedTools)]
/*
 * Determinism, not display order: this keeps a rebuild that changed no data from producing
 * a diff. Display order is src/pages/Skills.tsx, which re-sorts on every view because this
 * sort runs per category and so cannot order `All`. Neither is redundant.
 */
const categories = taxonomy.domains
  .map((d) => ({
    id: d.id,
    title: d.label,
    tools: allToolNames
      .filter((n) => domainOf(n) === d.id)
      .sort((a, b) => (toolProjects[b]?.length ?? 0) - (toolProjects[a]?.length ?? 0) || a.localeCompare(b))
      .map((name) => ({ name })),
  }))
  .filter((c) => c.tools.length > 0)

// The keyword block indexes everything, showcased or not, so recruiter tooling still
// matches on the application layer without it occupying the visible page.
const keywordTechnologies = taxonomy.entries
  .filter((e) => byTech.has(e.name))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b))

const hiddenCount = taxonomy.entries.filter((e) => !e.showcase && byTech.has(e.name)).length

// --- featured projects ---------------------------------------------------------------

// Order and selection both come from the YAML. `featured: true` is the projects repo's
// own flag, so the homepage follows whatever that repo decided to promote.
const CARD_TECH_LIMIT = 5
const toCard = (p) => ({
  title: displayOf(p.slug),
  description: (p.shortDescription ?? '').replace(/\s*\n\s*/g, ' ').trim(),
  tech: (p.tech ?? []).slice(0, CARD_TECH_LIMIT),
  url: `${PROJECTS_URL}/${p.slug}`,
})

const featured = projects.filter((p) => p.featured).map(toCard)

if (featured.length === 0) fail(['no project in projects.yaml is marked featured: true'])

// Order follows projects.yaml, so the two sites present the same sequence and there is
// no second ordering to keep in step.
const homepage = projects.filter((p) => p.homepage).map(toCard)

if (homepage.length === 0) fail(['no project in projects.yaml has homepage: true'])

const allTech = new Set(projects.flatMap((p) => p.tech ?? []))

const byKind = { tech: 0, tag: 0, link: 0 }
for (const k of Object.values(evidenceKind)) byKind[k]++

// --- emit ------------------------------------------------------------------------------

const banner = `// ================================================================
// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Source of truth:
//   https://github.com/ibtisam-iq/projects/blob/main/data/projects.yaml
// Written by scripts/generate-from-projects.js. Regenerate with: npm run generate
// ================================================================
`

const out = `${banner}
export interface ProjectRef {
  name: string
  slug: string
}

/**
 * How the projects repository evidences a tool. "tech" is a match in a project's
 * \`tech:\` list; "tag" and "link" cover entries naming a practice rather than a binary.
 */
export type EvidenceKind = "tech" | "tag" | "link"

export interface FeaturedProject {
  title: string
  description: string
  tech: string[]
  url: string
}

export const PROJECTS_URL = ${JSON.stringify(PROJECTS_URL)}

/** Total projects upstream, not only the featured ones. */
export const PROJECT_COUNT = ${projects.length}

/** Distinct entries across every project's \`tech:\` list. */
export const TECH_COUNT = ${allTech.size}

export interface ToolRef {
  name: string
}

export interface ToolCategory {
  id: string
  title: string
  tools: ToolRef[]
}

/**
 * The visible tools page, grouped by the projects repository's own six domains. Holds
 * only technologies flagged \`showcase: true\` in its TECH_REGISTRY that a project
 * actually uses, plus the trained tools. Within a group, most-used first.
 */
export const categories: ToolCategory[] = ${JSON.stringify(categories, null, 2)}

/** Distinct tools on the visible page: evidenced plus trained. */
export const TOTAL_TOOLS = ${allToolNames.length}

/**
 * Every technology any project uses, showcased or not, for the page's screen-reader
 * keyword block. Recruiter tooling matches on the application layer here without it
 * taking space on the visible page.
 */
export const keywordTechnologies: string[] = ${JSON.stringify(keywordTechnologies, null, 2)}

/** Technologies a project uses that are deliberately not shown. */
export const HIDDEN_TECH_COUNT = ${hiddenCount}

/** Tool label to the projects that use it, in upstream order. */
export const toolProjects: Record<string, ProjectRef[]> = ${JSON.stringify(toolProjects, null, 2)}

/** How each evidenced tool was matched. Keys mirror \`toolProjects\`. */
export const evidenceKind: Record<string, EvidenceKind> = ${JSON.stringify(evidenceKind, null, 2)}

/**
 * Tools known from training that no published project demonstrates, with a note on where
 * the knowledge came from. Absent from \`toolProjects\` by construction, so a tool is
 * never counted as both.
 */
export const trainedTools: Record<string, string> = ${JSON.stringify(trainedTools, null, 2)}

/** Tools on the skills page with at least one project behind them. */
export const EVIDENCED_COUNT = ${Object.keys(toolProjects).length}

/** Tools on the skills page known from training, with no project behind them. */
export const TRAINED_COUNT = ${Object.keys(trainedTools).length}

/** Projects flagged \`featured: true\`, in upstream order. */
export const featuredProjects: FeaturedProject[] = ${JSON.stringify(featured, null, 2)}

/** Projects flagged \`homepage: true\`, in upstream order. */
export const homepageProjects: FeaturedProject[] = ${JSON.stringify(homepage, null, 2)}

export const projectUrl = (slug: string): string => \`\${PROJECTS_URL}/\${slug}\`
`

mkdirSync(resolve(ROOT, 'src/data'), { recursive: true })
writeFileSync(OUT_FILE, out)

console.log(
  `  wrote src/data/generated.ts: ${projects.length} projects, ${featured.length} featured, ` +
    `${allTech.size} technologies`
)
console.log(
  `  tools: ${allToolNames.length} shown in ${categories.length} domains ` +
    `(${Object.keys(toolProjects).length} evidenced, ${Object.keys(trainedTools).length} trained), ` +
    `${hiddenCount} technologies indexed but hidden`
)
