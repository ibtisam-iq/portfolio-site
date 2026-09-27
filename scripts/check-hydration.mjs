// Hydration check for the built site: every route, both themes, in a real browser. Run
// with `npm run check:hydration` after a build; exits non-zero on a failure.

// Pre-rendering fails quietly. React finds markup it did not expect, throws the lot away,
// rebuilds the page on the client, and the visitor sees the right thing a moment late.
// Nothing is broken on screen, so only a check notices the gain is gone.

// What it can and cannot see: a production build recovers from a text or structure
// difference by discarding the tree, which this catches and which is the whole cost. A
// differing attribute is patched in place and passes here.

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
        file = join(DIST, '404.html')
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

const firstHeading = (html) => {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
  if (!m) return null
  return m[1]
    .replace(/<[^>]+>/g, '')
    .replace(/<!-- -->/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

let failures = 0
const problem = (msg) => { failures++; console.log(`  FAIL  ${msg}`) }

const routes = await routesFromRouter()
const shellFor = (route) => (route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`)

// The shells first, read off disk. A route whose markup never reached the file cannot be
// hydrated, and the browser would paper over it by rendering the page itself.
console.log('\n  rendered shells, read from disk\n')
{
  const seen = new Map()
  for (const route of [...routes, '/404.html']) {
    const file = route === '/404.html' ? '404.html' : shellFor(route)
    let html
    try {
      html = await readFile(join(DIST, file), 'utf8')
    } catch {
      problem(`${file} does not exist, so ${route} ships no markup`)
      continue
    }
    const body = html.slice(html.indexOf('<div id="root">') + 15)
    const heading = firstHeading(html)
    if (body.length < 1000) {
      problem(`${file} has ${body.length} characters in its root element`)
    } else if (!heading) {
      problem(`${file} carries no h1, so the rendered page is not the route's own`)
    } else if (seen.has(heading)) {
      problem(`${file} and ${seen.get(heading)} both render "${heading}"`)
    } else {
      seen.set(heading, file)
      console.log(`  ok    ${route.padEnd(16)} ${String(body.length).padStart(6)} chars  "${heading.slice(0, 40)}"`)
    }
  }
}

const { server, port } = await serve()
const base = `http://127.0.0.1:${port}`
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

console.log(`\n  hydration, ${routes.length} routes plus a dead one, both themes\n`)
for (const theme of ['dark', 'light']) {
  for (const route of [...routes, '/no-such-page']) {
    const page = await browser.newPage()

    // Nothing off this origin. The hero reads GitHub live and the analytics tag calls
    // home, and a rate limit on either would fail a check about markup. Answered empty
    // rather than aborted, because a blocked request is itself a console error.
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      if (req.url().startsWith(base)) req.continue()
      else {
        // The allow-origin header is part of the stand-in. Without it the browser rejects
        // the reply on the hero's cross-origin read and logs that, which is the console
        // error this whole detour exists to stop producing.
        req.respond({
          status: 204,
          contentType: 'text/plain',
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: '',
        })
      }
    })

    const noise = []
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') noise.push(`[${m.type()}] ${m.text()}`)
    })
    page.on('pageerror', (e) => noise.push(`[pageerror] ${e.message}`))

    // Installed before anything on the page runs. React reuses the server's nodes when it
    // hydrates and removes them when it gives up and starts again, so a removal from the
    // mount point is the difference between the two, and nothing on screen shows it.
    await page.evaluateOnNewDocument(() => {
      window.__rootEmptied = false
      new MutationObserver((records) => {
        for (const r of records) {
          if (r.target.id === 'root' && r.removedNodes.length) window.__rootEmptied = true
        }
      }).observe(document, { childList: true, subtree: true })
    })
    await page.evaluateOnNewDocument((t) => {
      try {
        localStorage.setItem('theme', t)
      } catch {
        // A context without storage falls back to the system preference, which the theme
        // assertion below then catches rather than measuring the wrong one.
      }
    }, theme)

    await page.setViewport({ width: 1350, height: 940 })
    await page.goto(base + route, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 1500))

    const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    const emptied = await page.evaluate(() => window.__rootEmptied)
    const tag = `${theme} ${route}`.padEnd(26)

    if (dark !== (theme === 'dark')) problem(`${tag} page is not in ${theme} mode`)
    else if (emptied) problem(`${tag} React discarded the rendered markup and started again`)
    else if (noise.length) {
      problem(`${tag} ${noise.length} console problem(s)`)
      for (const n of noise.slice(0, 4)) console.log(`          ${n.slice(0, 200)}`)
    } else console.log(`  ok    ${tag} adopted, console clean`)

    await page.close()
  }
}

await browser.close()
server.close()

console.log(failures === 0 ? '\n  all checks passed\n' : `\n  ${failures} check(s) failed\n`)
process.exit(failures ? 1 : 0)
