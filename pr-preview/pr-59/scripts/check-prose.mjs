// Enforces the writing rules for every comment and document in this repository, the way
// scripts/check-contrast.mjs enforces the colour ones: mechanically, with a line number,
// and non-zero on failure.
//
// Run: npm run check:prose

import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { basename, extname } from 'node:path'

// status.md is the one exclusion: a dated working log is a record, and rewriting one to
// match a style adopted afterwards destroys the only property it has.
const EXCLUDED = new Set(['status.md'])

// Files in another public repository. Naming one without its URL leaves a reader with a
// filename and nowhere to go.
const EXTERNAL = [
  'projects.yaml',
  'taxonomy.ts',
  'debugbox/README.md',
]

// Paths in a private repository, which a URL cannot fix: the reader gets a 404 and the
// mention publishes that repository's name and layout regardless. A constraint from one of
// these files is stated on its own terms or not at all.
const PRIVATE = [
  'career/context/',
  'ibtisam-iq/career',
]

const SOURCE_EXT = new Set([
  '.ts', '.tsx', '.js', '.mjs', '.css', '.yml', '.yaml', '.conf', '.html', '.tpl',
])
const HASH_EXT = new Set(['.yml', '.yaml', '.conf'])
const NAMED = new Set(['Dockerfile', '.dockerignore', '.gitignore', '.helmignore'])

// A header is two to four lines saying what the file is and what it is for. JSON cannot
// carry one and Markdown does not need one: its first heading is the header.
const NO_HEADER_EXT = new Set(['.html', '.tpl'])
const NEEDS_HEADER = (path) =>
  !NO_HEADER_EXT.has(extname(path)) &&
  (SOURCE_EXT.has(extname(path)) || NAMED.has(basename(path)))

const tracked = () => {
  const out = (args) => execFileSync('git', args, { encoding: 'utf8' }).split('\n')
  const all = [...out(['ls-files']), ...out(['ls-files', '--others', '--exclude-standard'])]
  return [...new Set(all)].filter(Boolean).filter((p) => existsSync(p))
}

const files = () => {
  return tracked()
    .filter((p) => !EXCLUDED.has(p))
    .filter((p) => {
      const ext = extname(p)
      return SOURCE_EXT.has(ext) || ext === '.md' || NAMED.has(basename(p))
    })
    .sort()
}

// Every basename in the repository that is not at the root, and not shadowed by a root
// file of the same name. A bare page or component name is ambiguous; `package.json` is
// not, because the root is the only place it can mean.
const nonRootBasenames = () => {
  // Every path, including the two the rules exclude: a root README.md still shadows
  // helm/README.md whether or not its own prose is checked.
  const all = tracked()
  const atRoot = new Set(all.filter((p) => !p.includes('/')))
  const map = new Map()
  for (const p of all) {
    if (!p.includes('/')) continue
    if (atRoot.has(basename(p))) continue
    map.set(basename(p), p)
  }
  return map
}

// --- comment extraction ---------------------------------------------------------------
//
// Returns [{ line, text, block }] where `block` groups the physical lines of one comment,
// so a rule can ask what the whole comment says rather than what one line of it says.

const jsComments = (src, cssOnly) => {
  const found = []
  let line = 1
  let i = 0
  let block = 0
  const push = (text, l) => found.push({ line: l, text, block })
  while (i < src.length) {
    const c = src[i]
    const next = src[i + 1]
    if (c === '\n') { line++; i++; continue }
    // An escape outside a string, which is how a regex literal spells a literal slash.
    // Without this, `/\/\*/` reads as the start of a block comment.
    if (c === '\\') { i += 2; continue }
    // Strings and template literals, skipped whole so a URL inside one is not a comment.
    if (c === '"' || c === "'" || c === '`') {
      const quote = c
      i++
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue }
        if (src[i] === '\n') line++
        if (src[i] === quote) { i++; break }
        i++
      }
      continue
    }
    if (c === '/' && next === '*') {
      block++
      const start = line
      i += 2
      let text = ''
      let l = start
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] === '\n') { push(text, l); text = ''; line++; l = line } else text += src[i]
        i++
      }
      push(text, l)
      i += 2
      continue
    }
    if (!cssOnly && c === '/' && next === '/') {
      block++
      let text = ''
      i += 2
      while (i < src.length && src[i] !== '\n') { text += src[i]; i++ }
      push(text, line)
      continue
    }
    i++
  }
  return found
}

const hashComments = (src) => {
  const found = []
  let block = 0
  let prevWasComment = false
  src.split('\n').forEach((raw, idx) => {
    const m = raw.match(/(^|\s)#(.*)$/)
    if (!m) { prevWasComment = false; return }
    if (!prevWasComment) block++
    prevWasComment = true
    found.push({ line: idx + 1, text: m[2], block })
  })
  return found
}

// A comment delimited by a pair of markers: HTML, and Helm templates.
const wrappedComments = (src, open, close) => {
  const found = []
  let i = 0
  let line = 1
  let block = 0
  while (i < src.length) {
    const at = src.indexOf(open, i)
    if (at === -1) break
    line += src.slice(i, at).split('\n').length - 1
    const end = src.indexOf(close, at + open.length)
    const stop = end === -1 ? src.length : end
    block++
    let l = line
    for (const text of src.slice(at + open.length, stop).split('\n')) {
      found.push({ line: l, text, block })
      l++
    }
    line = l - 1
    i = stop + close.length
  }
  return found
}

// Markdown is prose except where it quotes. A fenced block holds literals a reader copies,
// and a link destination is already correct relative to its own file, so rewriting either
// is a defect rather than a fix.
const markdownLines = (src) => {
  let fenced = false
  return src.split('\n').flatMap((raw, idx) => {
    if (/^\s*(```|~~~)/.test(raw)) {
      fenced = !fenced
      return []
    }
    if (fenced) return []
    // Inline code is deliberately still checked: naming a file in backticks is exactly how
    // prose refers to one, and that is the reference the path rule exists for.
    const text = raw.replace(/\]\([^)]*\)/g, '] ')
    return [{ line: idx + 1, text, block: 1 }]
  })
}

const commentsOf = (path, src) => {
  const ext = extname(path)
  if (ext === '.md') return markdownLines(src)
  if (ext === '.css') return jsComments(src, true)
  if (ext === '.html') return wrappedComments(src, '<!--', '-->')
  if (ext === '.tpl') return wrappedComments(src, '{{/*', '*/}}')
  if (HASH_EXT.has(ext) || NAMED.has(basename(path))) return hashComments(src)
  return jsComments(src, false)
}

// --- rules ------------------------------------------------------------------------------

const problems = []
const report = (path, line, rule, message) => problems.push({ path, line, rule, message })

// Built from its code point, so this file does not fail its own first rule.
const EM_DASH = String.fromCodePoint(0x2014)

// A comment states a constraint or a trap. Three lines of text is enough for that, and
// anything longer is explaining rather than constraining. Explanation belongs in
// REFERENCE.md, where a reader looking for it finds it and a reader changing one line does
// not walk past it. Delimiter-only lines do not count; the cap is on prose.
const MAX_COMMENT_LINES = 3
const MAX_HEADER_LINES = 6

const SECOND_PERSON = /\b([Yy]ou|[Yy]our|[Yy]ours|[Yy]ourself|[Yy]ou're|[Yy]ou'll|[Yy]ou've|[Yy]ou'd)\b/
const FIRST_PLURAL = /\b([Ww]e|[Ww]e're|[Ww]e've|[Ww]e'll|[Uu]s|[Oo]ur|[Oo]urs|[Oo]urselves)\b/
const PLAN_REF = /(\bplans\/|\bplan\s+\d)/i
const BARE_FILE = /(?<![\w/.-])([A-Za-z][\w-]*\.(?:tsx?|mjs|js|css|ya?ml|json|html|md))\b/g

const roots = nonRootBasenames()

for (const path of files()) {
  const src = readFileSync(path, 'utf8')
  const comments = commentsOf(path, src)

  // Rule 1. The em dash, anywhere in the file, comment or not.
  src.split('\n').forEach((text, idx) => {
    if (text.includes(EM_DASH)) report(path, idx + 1, 'em-dash', 'em dash')
  })

  // Rule 9. No comment block longer than MAX_COMMENT_LINES. Markdown is exempt: a document
  // is prose by definition, and this rule exists to keep prose out of source files.
  if (extname(path) !== '.md') {
    const runs = []
    let start = null
    let count = 0
    let text = 0
    // Commented-out configuration is disabled code, not explanation, and the cap is on
    // explanation. This is the same exemption a fenced code block gets in Markdown: a
    // reader uncomments these lines, they do not read them as prose.
    const isProse = (t) => {
      const body = t.replace(/^[\s*/]+|[\s*/]+$/g, '')
      if (body.length === 0) return false
      if (/^[-{}[\]]/.test(body)) return false
      if (/^[\w.*/-]+:\s*\S*$/.test(body)) return false
      if (/^[\w.*-]+$/.test(body)) return false
      return true
    }
    for (const c of comments) {
      if (start !== null && c.line === start + count) {
        count++
        if (isProse(c.text)) text++
      } else {
        if (start !== null) runs.push([start, count, text])
        start = c.line
        count = 1
        text = isProse(c.text) ? 1 : 0
      }
    }
    if (start !== null) runs.push([start, count, text])
    for (const [line, len, text] of runs) {
      const cap = line <= 3 ? MAX_HEADER_LINES : MAX_COMMENT_LINES
      // Delimiter-only lines are not prose: the cap limits how much a reader walks past.
      if (text > cap) {
        report(path, line, 'long-comment', `${text} lines of text, cap is ${cap}`)
      }
      void len
    }
  }

  // Rule 8. A header comment inside the first three lines.
  if (NEEDS_HEADER(path)) {
    const opener = extname(path) === '.css' ? /^\s*\/\*/
      : HASH_EXT.has(extname(path)) || NAMED.has(basename(path)) ? /^\s*#/
        : /^\s*(\/\/|\/\*)/
    const head = src.split('\n').slice(0, 3)
    if (!head.some((l) => opener.test(l))) {
      report(path, 1, 'no-header', 'no header comment saying what this file is and what it is for')
    }
  }

  // The prose rules apply to comments and Markdown, never to a string the reader sees.
  const blocks = new Map()
  for (const c of comments) {
    blocks.set(c.block, (blocks.get(c.block) ?? '') + ' ' + c.text)
  }

  // Externals this file locates: named anywhere in it alongside a URL. Scoped to the file,
  // because a header that gives the URL on one line and the filename on the next has still
  // located it.
  const allComments = comments.map((c) => c.text).join('\n')
  const introduced = new Set(
    /https?:\/\//.test(allComments) ? EXTERNAL.filter((n) => allComments.includes(n)) : []
  )

  for (const c of comments) {
    const t = c.text
    if (!t.trim()) continue

    // Rule 2. Second person.
    const sp = t.match(SECOND_PERSON)
    if (sp) report(path, c.line, 'second-person', `"${sp[0]}"`)

    // Rule 3. First person plural.
    const fp = t.match(FIRST_PLURAL)
    if (fp) report(path, c.line, 'first-plural', `"${fp[0]}"`)

    // Rule 4. The planning tree, which a reader of this repository does not have.
    const pr = t.match(PLAN_REF)
    if (pr) report(path, c.line, 'plan-ref', `"${pr[0].trim()}"`)

    // Rule 5. A file in another public repository, named without its URL anywhere in this
    // file. Scoped to the file, not the mention: repeating a URL at every mention makes the
    // writing worse, and what this catches is a source that is never located at all.
    for (const name of EXTERNAL) {
      if (!t.includes(name)) continue
      if (introduced.has(name)) continue
      report(path, c.line, 'no-url', `"${name}" is named in this file and never linked`)
    }

    // Rule 5b. A path inside a private repository, which no reader of this one can open.
    for (const name of PRIVATE) {
      if (t.includes(name)) {
        report(path, c.line, 'private-ref', `"${name}" is in a private repository`)
      }
    }

    // Rule 6. A file inside this repository, named without its path.
    for (const m of t.matchAll(BARE_FILE)) {
      const name = m[1]
      const full = roots.get(name)
      if (!full) continue
      if (EXTERNAL.includes(name)) continue
      report(path, c.line, 'bare-path', `"${name}" should be "${full}"`)
    }
  }
}

// --- output -----------------------------------------------------------------------------

const byFile = new Map()
for (const p of problems) {
  if (!byFile.has(p.path)) byFile.set(p.path, [])
  byFile.get(p.path).push(p)
}

const counts = new Map()
for (const p of problems) counts.set(p.rule, (counts.get(p.rule) ?? 0) + 1)

console.log('')
for (const [path, list] of [...byFile].sort()) {
  console.log(`  ${path}`)
  for (const p of list.sort((a, b) => a.line - b.line)) {
    console.log(`    ${String(p.line).padStart(4)}  ${p.rule.padEnd(14)} ${p.message}`)
  }
  console.log('')
}

if (problems.length === 0) {
  console.log('  all checks passed\n')
  process.exit(0)
}

console.log('  ' + [...counts].sort((a, b) => b[1] - a[1]).map(([r, n]) => `${r} ${n}`).join(', '))
console.log(`  ${problems.length} in ${byFile.size} files\n`)
process.exit(1)
