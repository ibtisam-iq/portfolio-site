// Runs AFTER `vite build`, as the last step of `npm run build`.
// Reads:  dist/index.html (the built shell)
// Writes: dist/<route>/index.html, one per route, with route-specific meta.
//
// Why this exists: the site is a client-rendered SPA, so every route serves the
// same index.html. useCanonical fixes the tags in the browser, but crawlers that
// do not run JavaScript (LinkedIn, Slack, Twitter) read the raw HTML and see the
// site-root canonical and og:url on every page. Cloning the shell per route and
// swapping the meta block gives those crawlers the right values without adding a
// prerenderer, a headless browser, or any runtime dependency. React still renders
// the page itself on the client, exactly as before.
//
// Routes are declared here rather than in a data file: unlike projects.ibtisam-iq.com,
// this site has a fixed set of pages defined directly in src/App.tsx. Adding a route
// there means adding it here, and the CI check will fail until it is.

import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const SITE = 'https://ibtisam-iq.com'
const SUFFIX = ' | Muhammad Ibtisam Iqbal'

// Escape for use inside a double-quoted HTML attribute.
const attr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// `/` keeps the shell Vite emitted, so it is not listed here.
const routes = [
  {
    path: '/skills',
    title: 'Skills',
    description:
      'Sixty-six tools across nine categories, each cross-referenced to the projects it was used in: Kubernetes, AWS, Terraform, CI/CD, observability, and container security.',
  },
  {
    path: '/certificates',
    title: 'Certifications',
    description:
      'CKA and CKAD, both performance-based CNCF exams sat in a live cluster, with certificate IDs and independent verification. CKS and AWS Solutions Architect in progress.',
  },
  {
    path: '/about',
    title: 'About',
    description:
      'How a horticulture postgraduate became a DevOps and Cloud Engineer: the background, the transition, and what the work has looked like since.',
  },
  {
    path: '/contact',
    title: 'Contact',
    description:
      'Get in touch about DevOps, platform and cloud engineering roles, or about any of the published projects, tools and write-ups.',
  },
]

const template = readFileSync('dist/index.html', 'utf8')

// Each entry replaces exactly one tag in the built shell. Patterns tolerate the
// multi-line attribute layout Vite preserves from index.html. A pattern that
// matches nothing is a failure, not a no-op: the head changed and this script did not.
const rewrites = (m) => {
  const title = attr(m.title + SUFFIX)
  const description = attr(m.description)
  const url = `${SITE}${m.path}`
  return [
    [/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`],
    [/<meta\s+name="description"[^>]*>/, `<meta name="description" content="${description}" />`],
    [/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`],
    [/<meta\s+property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`],
    [
      /<meta\s+property="og:description"[^>]*>/,
      `<meta property="og:description" content="${description}" />`,
    ],
    [/<meta\s+property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`],
    [/<meta\s+name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`],
    [
      /<meta\s+name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${description}" />`,
    ],
  ]
}

for (const m of routes) {
  let html = template
  for (const [pattern, replacement] of rewrites(m)) {
    if (!pattern.test(html)) {
      throw new Error(
        `prerender-meta: pattern ${pattern} did not match dist/index.html.\n` +
          `The head in index.html changed. Update scripts/prerender-meta.js to match.`
      )
    }
    html = html.replace(pattern, replacement)
  }
  mkdirSync(`dist${m.path}`, { recursive: true })
  writeFileSync(`dist${m.path}/index.html`, html)
}

console.log(`✅ Prerendered meta for ${routes.length} routes (og:url, canonical, title)`)
