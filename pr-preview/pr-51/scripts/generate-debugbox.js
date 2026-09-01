// Derives the DebugBox variant table and commands from
// https://github.com/ibtisam-iq/debugbox/blob/main/README.md, writing src/data/debugbox.ts.
// A sibling clone at ../debugbox wins; DEBUGBOX_README_SOURCE=remote forces the fetch.
//

// The README rather than that project's own manifest, which carries no image sizes and does
// not currently parse as YAML. Prefer the manifest if it is ever fixed and given sizes.

// Every parse below is asserted, so a heading rename upstream fails this build rather than
// shipping a stale command.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

const LOCAL_README = resolve(ROOT, '../debugbox/README.md')
const REMOTE_README = 'https://raw.githubusercontent.com/ibtisam-iq/debugbox/main/README.md'
const OUT_FILE = resolve(ROOT, 'src/data/debugbox.ts')

const REPO_URL = 'https://github.com/ibtisam-iq/debugbox'
const DOCS_URL = 'https://debugbox.ibtisam-iq.com'
const TUTORIAL_URL =
  'https://labs.iximiuz.com/tutorials/kubernetes-debugging-with-debugbox-74e481c8'

// Ordered smallest first, which is the order the README presents and the order the
// decision tree walks. `balanced` is the untagged default image.
const VARIANT_ORDER = ['lite', 'balanced', 'power']
const DEFAULT_VARIANT = 'balanced'

const fail = (lines) => {
  console.error(
    'generate-debugbox failed:\n' + lines.map((l) => '  - ' + l).join('\n')
  )
  process.exit(1)
}

async function loadReadme() {
  const forceRemote = process.env.DEBUGBOX_README_SOURCE === 'remote'

  if (!forceRemote && existsSync(LOCAL_README)) {
    console.log(`  source: ${LOCAL_README} (local sibling)`)
    return readFileSync(LOCAL_README, 'utf8')
  }

  console.log(`  source: ${REMOTE_README}`)
  const res = await fetch(REMOTE_README, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) {
    fail([
      `fetching the DebugBox README returned HTTP ${res.status}`,
      'clone github.com/ibtisam-iq/debugbox next to this repo to build offline',
    ])
  }
  return res.text()
}

const readme = await loadReadme()

// --- sizes, from the "Size Comparison" table ------------------------------------------

// Rows look like: | DebugBox lite | ~15 MB |
const sizeRows = [...readme.matchAll(/^\|\s*([^|]+?)\s*\|\s*~?([\d.]+)\s*MB\s*\|$/gm)].map(
  (m) => ({ label: m[1].trim(), mb: Number(m[2]) })
)

if (sizeRows.length === 0) {
  fail(['no "| name | ~N MB |" rows found. Has the Size Comparison table changed shape?'])
}

const sizeOf = (variant) => {
  const row = sizeRows.find((r) => r.label.toLowerCase() === `debugbox ${variant}`)
  if (!row) fail([`no size row for "DebugBox ${variant}" in the README size table`])
  return row.mb
}

const netshootRow = sizeRows.find((r) => /^netshoot/i.test(r.label))
if (!netshootRow) fail(['no netshoot row in the README size table, so no comparison baseline'])

// --- taglines, from the "Three sizes:" bullet list -------------------------------------

// Bullets look like: - **LITE** (~15 MB): DNS and connectivity
const taglines = Object.fromEntries(
  [...readme.matchAll(/^-\s+\*\*([A-Z]+)\*\*\s*\([^)]*\):\s*(.+)$/gm)].map((m) => [
    m[1].toLowerCase(),
    m[2].trim(),
  ])
)

// --- commands, from the Quick Start fenced blocks ---------------------------------------

const blockAfter = (heading) => {
  const re = new RegExp(`###\\s+${heading}[\\s\\S]*?\`\`\`bash\\n([\\s\\S]*?)\`\`\``, 'm')
  const m = readme.match(re)
  if (!m) fail([`no \`\`\`bash block found under "### ${heading}" in the README`])
  return m[1]
}

const k8sBlock = blockAfter('Kubernetes')
const dockerBlock = blockAfter('Docker')

// Pulls the first command line that mentions this exact image reference, so a tag is
// never guessed. The untagged image is matched with a boundary check, otherwise
// ":lite" would also satisfy a search for the bare name.
const findCommand = (block, imageRef, { exact = false } = {}) => {
  for (const raw of block.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    if (!line.includes(imageRef)) continue
    if (exact) {
      const after = line.slice(line.indexOf(imageRef) + imageRef.length, line.indexOf(imageRef) + imageRef.length + 1)
      if (after === ':') continue
    }
    return line
  }
  return null
}

const IMAGE = 'ghcr.io/ibtisam-iq/debugbox'

const variants = VARIANT_ORDER.map((id) => {
  const isDefault = id === DEFAULT_VARIANT
  const ref = isDefault ? IMAGE : `${IMAGE}:${id}`

  const kubectl = findCommand(k8sBlock, ref, { exact: isDefault })
  const docker = findCommand(dockerBlock, ref, { exact: isDefault })

  if (!kubectl) fail([`no kubectl command using "${ref}" in the README Kubernetes block`])
  if (!docker) fail([`no docker command using "${ref}" in the README Docker block`])

  if (!taglines[id]) fail([`no "- **${id.toUpperCase()}** (...): ..." bullet in the README`])

  return {
    id,
    label: id[0].toUpperCase() + id.slice(1),
    sizeMB: sizeOf(id),
    tagline: taglines[id],
    isDefault,
    commands: [
      // Trailing "# balanced (default)" style comments read as noise once the variant
      // is already named by the selected tab.
      { label: 'kubectl debug', command: kubectl.replace(/\s{2,}#.*$/, '').trim() },
      { label: 'docker run', command: docker.replace(/\s{2,}#.*$/, '').trim() },
    ],
  }
})

// A standalone pod is the fallback for clusters below Kubernetes 1.23, where
// `kubectl debug` does not exist. Worth carrying because it widens who can run this.
const runCommand = k8sBlock
  .split('\n')
  .map((l) => l.trim())
  .find((l) => l.startsWith('kubectl run'))

if (!runCommand) fail(['no "kubectl run" standalone command in the README Kubernetes block'])

const smallest = variants[0]
const reductionPct = Math.round(((netshootRow.mb - smallest.sizeMB) / netshootRow.mb) * 100)

const out = `// ================================================================
// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Source: https://github.com/ibtisam-iq/debugbox/blob/main/README.md
// Regenerate with: npm run generate
// ================================================================

export interface DebugBoxCommand {
  label: string
  command: string
}

export interface DebugBoxVariant {
  id: string
  label: string
  /** Compressed image size in MB, as published in the README size table. */
  sizeMB: number
  tagline: string
  /** True for the image published without a tag suffix. */
  isDefault: boolean
  commands: DebugBoxCommand[]
}

export const variants: DebugBoxVariant[] = ${JSON.stringify(variants, null, 2)}

/** The image DebugBox is measured against, from the same README table. */
export const comparison = ${JSON.stringify({ label: netshootRow.label, sizeMB: netshootRow.mb }, null, 2)}

/** Smallest variant against the comparison image, rounded. Derived, never typed. */
export const REDUCTION_PCT = ${reductionPct}

/** Works on clusters older than 1.23, where \`kubectl debug\` is unavailable. */
export const standaloneCommand = ${JSON.stringify(runCommand)}

export const REPO_URL = ${JSON.stringify(REPO_URL)}
export const DOCS_URL = ${JSON.stringify(DOCS_URL)}
export const TUTORIAL_URL = ${JSON.stringify(TUTORIAL_URL)}
`

mkdirSync(resolve(ROOT, 'src/data'), { recursive: true })
writeFileSync(OUT_FILE, out)

console.log(
  `  wrote src/data/debugbox.ts: ${variants.length} variants ` +
    `(${variants.map((v) => `${v.id} ${v.sizeMB}MB`).join(', ')}), ` +
    `${reductionPct}% smaller than ${netshootRow.label}`
)
