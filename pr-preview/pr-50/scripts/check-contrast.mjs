// Contrast regression check for the built site: every route, both themes, in a real
// browser. Run with `npm run check:contrast` after a build; exits non-zero on a failure.
// The three things it depends on are in REFERENCE.md.

import { createServer } from 'http'
import { readFile, stat } from 'fs/promises'
import { existsSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

if (!existsSync(DIST)) {
  console.error('  dist/ not found. Run `npm run build` first.')
  process.exit(1)
}

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.txt': 'text/plain',
  '.xml': 'application/xml', '.webmanifest': 'application/manifest+json',
}

/** Static server with directory-index resolution, which is what a real host does. */
const serve = () =>
  new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const path = decodeURIComponent(req.url.split('?')[0])
      let file = join(DIST, path)
      try {
        if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
      } catch {
        res.writeHead(404).end('not found')
        return
      }
      try {
        const body = await readFile(file)
        res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' })
        res.end(body)
      } catch {
        res.writeHead(404).end('not found')
      }
    })
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }))
  })

/** Every concrete route the router declares, wildcards excluded. */
const routesFromRouter = async () => {
  const src = await readFile(join(ROOT, 'src', 'App.tsx'), 'utf8')
  const paths = [...src.matchAll(/path="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== '*')
  return [...new Set(paths)]
}

const sitemapRoutes = async () => {
  const xml = await readFile(join(DIST, 'sitemap.xml'), 'utf8')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
}

/**
 * Every text node measured against the surface actually painted behind it. It walks text
 * nodes rather than elements, or the text a parent holds beside a child is never measured.
 *
 * The background walk composites alpha rather than stopping at the first non-transparent
 * ancestor: most surfaces here are translucent, and stopping early passes what fails.
 * `aria-hidden` subtrees are skipped, because WCAG applies to text that informs.
 */
const SWEEP = () => {
  const lum = (c) => {
    const m = c.match(/[\d.]+/g)
    if (!m) return null
    const [r, g, b] = m.map(Number)
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const blend = (fg, bg, a) => fg.map((v, i) => v * a + bg[i] * (1 - a))
  const bgOf = (el) => {
    let n = el
    const stack = []
    while (n && n !== document.documentElement) {
      const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g)
      if (m) {
        const a = m.length > 3 ? Number(m[3]) : 1
        if (a > 0) { stack.push([m.slice(0, 3).map(Number), a]); if (a >= 0.999) break }
      }
      n = n.parentElement
    }
    const base = getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g)
    let cur = base ? base.slice(0, 3).map(Number) : [255, 255, 255]
    for (let i = stack.length - 1; i >= 0; i--) cur = blend(stack[i][0], cur, stack[i][1])
    return `rgb(${cur.join(',')})`
  }
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

  const SKIP = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TITLE']
  const out = []
  let checked = 0
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node
  while ((node = walker.nextNode())) {
    const t = (node.textContent || '').trim()
    if (t.length < 2) continue
    const el = node.parentElement
    if (!el || SKIP.includes(el.tagName)) continue
    if (el.closest('[aria-hidden="true"]')) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.5) continue
    const r = el.getBoundingClientRect()
    // Width 1px is the clip-rect idiom for visually-hidden SEO copy, which is read aloud
    // rather than looked at, so it has no contrast to fail.
    if (!r.width || !r.height || r.width <= 1) continue
    checked++
    const px = parseFloat(cs.fontSize)
    const large = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700)
    const need = large ? 3 : 4.5
    const cr = ratio(cs.color, bgOf(el))
    if (cr < need) out.push({ t: t.slice(0, 34), px, ratio: +cr.toFixed(2), need, color: cs.color, bg: bgOf(el) })
  }
  return { checked, failures: out }
}

/** The 71 generated tool marks, whose hue varies but whose saturation and lightness do not. */
const MARKS = () => {
  const lum = (c) => {
    const [r, g, b] = c.match(/[\d.]+/g).map(Number)
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
  const marks = [...document.querySelectorAll('.mark')]
  const rs = marks.map((m) => { const cs = getComputedStyle(m); return ratio(cs.color, cs.backgroundColor) }).sort((a, b) => a - b)
  return {
    count: marks.length,
    blank: marks.filter((m) => !m.textContent.trim()).length,
    worst: +rs[0]?.toFixed(2),
    belowAA: rs.filter((r) => r < 4.5).length,
  }
}

// Seed the stored choice before the page loads, so public/theme.js applies the theme under
// test before first paint. Clicking the toggle instead assumed the site always opens dark,
// which stopped being true once the theme began following the operating system: on a
// light-configured machine that wait never resolved.
const seedTheme = async (page, theme) => {
  await page.evaluateOnNewDocument((t) => {
    try {
      localStorage.setItem('theme', t)
    } catch {
      // A context without storage falls back to the system preference, which the assertion
      // below then catches rather than silently measuring the wrong theme.
    }
  }, theme)
}

// The theme is a precondition of every measurement, so it is asserted rather than assumed.
const assertTheme = async (page, theme) => {
  const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  if (dark !== (theme === 'dark')) throw new Error(`page is not in ${theme} mode`)
}

const { server, port } = await serve()
const base = `http://127.0.0.1:${port}`
const routes = await routesFromRouter()
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()

let failures = 0
const problem = (msg) => { failures++; console.log(`  FAIL  ${msg}`) }

// Route parity first, because a page that does not exist cannot be checked for anything
// else, and a sitemap advertising a page the router does not have sends crawlers to a 404.
console.log('\n  route parity, router against the build\n')
{
  const sm = await sitemapRoutes()
  for (const r of routes) {
    if (!sm.includes(r)) problem(`router has ${r}, sitemap.xml does not list it`)
  }
  for (const r of sm) {
    if (!routes.includes(r)) problem(`sitemap.xml advertises ${r}, the router has no such route`)
  }
  if (failures === 0) console.log(`  ok    ${String(routes.length).padStart(2)} routes, router and sitemap agree`)
}

console.log(`\n  contrast, ${routes.length} routes from src/App.tsx, both themes\n`)
await page.setViewport({ width: 1440, height: 1000 })
for (const route of routes) {
  for (const theme of ['dark', 'light']) {
    await seedTheme(page, theme)
    const res = await page.goto(base + route, { waitUntil: 'networkidle0' })
    // A route the router declares must actually have a shell in the build. This is the
    // check that catches a renamed route whose prerendered shell was left behind.
    if (res.status() !== 200) { problem(`${route} is in the router but returned ${res.status()} from the build`); continue }
    await assertTheme(page, theme)
    const { checked, failures: bad } = await page.evaluate(SWEEP)
    const tag = `${route} ${theme}`.padEnd(26)
    if (bad.length === 0) {
      console.log(`  ok    ${tag} ${String(checked).padStart(3)} nodes`)
    } else {
      problem(`${tag} ${bad.length} of ${checked} nodes below AA`)
      for (const f of bad.slice(0, 6)) {
        console.log(`          ${f.ratio} (needs ${f.need})  ${f.px}px  "${f.t}"`)
        console.log(`          ${f.color} on ${f.bg}`)
      }
    }
  }
}

console.log('\n  generated tool marks\n')
for (const theme of ['dark', 'light']) {
  await seedTheme(page, theme)
  await page.goto(`${base}/tools`, { waitUntil: 'networkidle0' })
  await assertTheme(page, theme)
  await page.evaluate(() => [...document.querySelectorAll('[role=tab]')].find((t) => t.textContent.startsWith('All'))?.click())
  await new Promise((r) => setTimeout(r, 250))
  const m = await page.evaluate(MARKS)
  if (m.belowAA || m.blank) problem(`marks ${theme}: ${m.belowAA} below AA, ${m.blank} blank`)
  else console.log(`  ok    ${theme.padEnd(26)} ${m.count} marks, worst ${m.worst}, none blank`)
}

console.log('\n  horizontal overflow at 375px\n')
await page.setViewport({ width: 375, height: 812 })
await seedTheme(page, 'dark')
for (const route of routes) {
  await page.goto(base + route, { waitUntil: 'networkidle0' })
  await assertTheme(page, 'dark')
  const o = await page.evaluate(() => ({ w: document.body.scrollWidth, c: document.documentElement.clientWidth }))
  if (o.w > o.c) problem(`${route} body is ${o.w}px in a ${o.c}px viewport`)
  else console.log(`  ok    ${route.padEnd(26)} ${o.w}px`)
}

await browser.close()
server.close()

console.log(failures === 0 ? '\n  all checks passed\n' : `\n  ${failures} check(s) failed\n`)
process.exit(failures ? 1 : 0)
