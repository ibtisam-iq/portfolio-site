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
import { profile } from './profile.js'

const SITE = profile.site
const SUFFIX = ` | ${profile.name}`

// The /skills description quotes a tool and category count. src/data/skills.ts is
// where the page derives them, so read them from there rather than restating them:
// a hardcoded figure is right until the next tool is added.
const skillsSrc = readFileSync('src/data/skills.ts', 'utf8')
const TOOL_COUNT = new Set([...skillsSrc.matchAll(/name:\s*["']([^"']+)["']/g)].map((m) => m[1]))
  .size
const CATEGORY_COUNT = (skillsSrc.match(/title:\s*["']/g) || []).length
if (!TOOL_COUNT || !CATEGORY_COUNT) {
  throw new Error('prerender-meta: could not read tool or category counts from src/data/skills.ts')
}

// Escape for use inside a double-quoted HTML attribute.
const attr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// `/` keeps the shell Vite emitted, so it is not listed here.
const routes = [
  {
    path: '/skills',
    title: 'Engineering Stack',
    description:
      `${TOOL_COUNT} tools across ${CATEGORY_COUNT} categories, each cross-referenced to the projects it was used in: Kubernetes, EKS, Docker, Terraform, ArgoCD, Jenkins, GitHub Actions, Trivy, Prometheus and Grafana.`,
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
      'How a horticulture postgraduate became a CKA and CKAD certified DevOps and Cloud Engineer working on Kubernetes, AWS and CI/CD: the background, the transition, and the work since.',
  },
  {
    path: '/contact',
    title: 'Contact',
    description:
      'Open to DevOps, platform and cloud engineering roles. Contact details, availability, and links to every published project, tool and write-up.',
  },
]

// JSON-LD is built from scripts/profile.js and swapped into the shell before any
// route is cloned, so every page carries it and there is only one place to edit.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  alternateName: profile.alternateName,
  url: profile.site,
  jobTitle: profile.jobTitle,
  email: profile.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: profile.location.city,
    addressCountry: profile.location.country,
  },
  alumniOf: { '@type': 'CollegeOrUniversity', name: profile.alumniOf },
  hasCredential: profile.credentials.map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    name: c.name,
    credentialCategory: 'certification',
    identifier: c.id,
    url: c.url,
    recognizedBy: { '@type': 'Organization', name: c.issuer },
  })),
  sameAs: profile.profiles.map((p) => p.url),
  knowsAbout: profile.knowsAbout,
}

const shell = readFileSync('dist/index.html', 'utf8')
const LD_PATTERN = /<script type="application\/ld\+json">[\s\S]*?<\/script>/
if (!LD_PATTERN.test(shell)) {
  throw new Error(
    'prerender-meta: no ld+json block in dist/index.html. Restore the placeholder in index.html.'
  )
}
const template = shell.replace(
  LD_PATTERN,
  `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>`
)
writeFileSync('dist/index.html', template)

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

const apply = (html, pairs) => {
  for (const [pattern, replacement] of pairs) {
    if (!pattern.test(html)) {
      throw new Error(
        `prerender-meta: pattern ${pattern} did not match dist/index.html.\n` +
          `The head in index.html changed. Update scripts/prerender-meta.js to match.`
      )
    }
    html = html.replace(pattern, replacement)
  }
  return html
}

for (const m of routes) {
  const html = apply(template, rewrites(m))
  mkdirSync(`dist${m.path}`, { recursive: true })
  writeFileSync(`dist${m.path}/index.html`, html)
}

// Pages serves 404.html on any unmatched path, where React Router renders
// NotFound. Copying index.html verbatim would hand crawlers the home page's
// title, canonical and `index, follow` on every dead URL, so build it here
// instead: own title, no canonical pointing at `/`, and noindex.
const notFound = apply(template, [
  [/<title>[\s\S]*?<\/title>/, `<title>Page Not Found${attr(SUFFIX)}</title>`],
  [
    /<meta\s+name="description"[^>]*>/,
    '<meta name="description" content="This page does not exist." />',
  ],
  [/<meta\s+name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow" />'],
  // Self-referential rather than `/`, so a dead URL never claims to be the home page.
  [/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${SITE}/404.html" />`],
  [/<meta\s+property="og:url"[^>]*>/, `<meta property="og:url" content="${SITE}/404.html" />`],
  [
    /<meta\s+property="og:title"[^>]*>/,
    `<meta property="og:title" content="Page Not Found${attr(SUFFIX)}" />`,
  ],
  [
    /<meta\s+name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="Page Not Found${attr(SUFFIX)}" />`,
  ],
])
writeFileSync('dist/404.html', notFound)

// sitemap.xml is generated from the same `routes` array the shells come from, so a
// route can never be prerendered but missing from the sitemap, or the reverse.
// No <lastmod>: it would be the build date on every entry, telling crawlers that
// every page changed whenever any page did.
const urls = ['/', ...routes.map((m) => m.path)]
  .map((p) => `  <url><loc>${SITE}${p}</loc></url>`)
  .join('\n')
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
)

// robots.txt lists only the sitemaps profile.js records as returning XML.
//
// The listed sitemaps are on sibling subdomains rather than this host. A crawler is
// free to ignore a cross-domain Sitemap directive, and Google only acts on one when
// both hosts are verified under the same Search Console account, so this is a hint
// and not a guarantee. Each site still serves its own robots.txt naming its own
// sitemap, which is the path that always works.
const sitemaps = profile.sites.filter((s) => s.sitemap)
const skipped = profile.sites.filter((s) => !s.sitemap)
writeFileSync(
  'dist/robots.txt',
  [
    `# ${profile.site.replace('https://', '')}`,
    `# ${profile.name} — ${profile.jobTitle}`,
    '# Generated by scripts/prerender-meta.js from scripts/profile.js. Do not edit.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Each site is a separate deployment on its own subdomain and serves its own',
    '# robots.txt. They are collected here so one fetch reaches all of them.',
    ...sitemaps.map((s) => `Sitemap: ${s.sitemap}`),
    '',
    '# Part of the estate, but not a site I publish a sitemap for:',
    ...skipped.map((s) => `#   ${s.url}`),
    '',
    `# Structured profile data: ${profile.site}/profile.json`,
    `# Guide for AI agents:     ${profile.site}/llms.txt`,
    '',
  ].join('\n')
)

// llms.txt is a convention rather than a standard, and nothing is obliged to fetch it.
// It costs one generated file to answer the question an agent would otherwise answer by
// guessing from rendered HTML, so it is worth having either way.
//
// section() returns null, not '', when a group is empty: the filter below drops absent
// sections, and '' would be dropped alongside the blank lines that separate the rest.
const section = (heading, items) =>
  items.length ? [`## ${heading}`, '', ...items, ''].join('\n') : null
const link = (s) => `- [${s.label}](${s.url}): ${s.note}`
writeFileSync(
  'dist/llms.txt',
  [
    `# ${profile.name}`,
    '',
    `> ${profile.summary}`,
    '',
    'Every claim on these sites is written by me. Where an independent source can',
    'check it, the link is provided rather than the claim restated.',
    '',
    section('Start here', [
      ...profile.sites.filter((s) => s.group === 'start').map(link),
      `- [CV](${profile.site}/cv.pdf): resume as PDF`,
    ]),
    section('Writing', profile.sites.filter((s) => s.group === 'writing').map(link)),
    section('Open source', profile.sites.filter((s) => s.group === 'oss').map(link)),
    section('Independently verifiable', [
      ...profile.credentials.map((c) => `- [${c.name}](${c.url}), credential ID ${c.id}`),
      ...profile.profiles.filter((p) => p.verifiable).map((p) => `- [${p.label}](${p.url})`),
    ]),
    section('Elsewhere', profile.profiles.filter((p) => !p.verifiable).map((p) => `- [${p.label}](${p.url})`)),
    section('Contact', [`- ${profile.email}`]),
    `Machine-readable version of all of the above: ${profile.site}/profile.json`,
    '',
  ]
    .filter((l) => l !== null)
    .join('\n')
)

// profile.js verbatim, served over HTTP so other repositories and tooling can read
// these facts without vendoring them.
writeFileSync('dist/profile.json', JSON.stringify(profile, null, 2) + '\n')

console.log(
  `✅ ${routes.length} routes, 404.html, sitemap.xml (${urls.split('\n').length} URLs), ` +
    `robots.txt (${sitemaps.length} sitemaps), llms.txt, profile.json — all from scripts/profile.js`
)
