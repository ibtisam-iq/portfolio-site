// The last step of `npm run build`. Reads dist/index.html and writes one shell per route
// with its own metadata, plus 404.html, the sitemap, robots.txt, llms.txt and profile.json.
// A crawler that does not run JavaScript would otherwise see the site root on every page.
//
// The `routes` array below has to track src/App.tsx. The Pages workflow derives its own
// list from that router and fails if a route here is missing.

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { profile } from './profile.js'

const SITE = profile.site
const SUFFIX = ` | ${profile.name}`

// Counts are read back out of src/data/generated.ts rather than restated: a figure typed
// here is right only until the next technology is registered upstream.
const generatedSrc = readFileSync('src/data/generated.ts', 'utf8')
const TOOL_COUNT = Number(generatedSrc.match(/TOTAL_TOOLS = (\d+)/)?.[1])
// Scoped to the categories array: "title" also appears in the project card arrays,
// and matching those inflated this count from 6 to 18.
const categoriesBlock = generatedSrc.slice(
  generatedSrc.indexOf('categories: ToolCategory[]'),
  generatedSrc.indexOf('export const TOTAL_TOOLS')
)
const CATEGORY_COUNT = (categoriesBlock.match(/"title":/g) || []).length
if (!TOOL_COUNT || !CATEGORY_COUNT) {
  throw new Error(
    'prerender-meta: could not read TOTAL_TOOLS or category count from src/data/generated.ts. ' +
      'Run `npm run generate` first.'
  )
}

// Escape for use inside a double-quoted HTML attribute.
const attr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// `/` keeps the shell Vite emitted, so it is not listed here.
const routes = [
  {
    // Renamed from /skills when the route was renamed. Left behind, it emitted dist/skills/
    // while App.tsx routed /tools, so /tools returned the 404 shell on any host without an
    // SPA fallback and its og:url and title never reached a crawler.
    path: '/tools',
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

// Built here, never copied from index.html: a copy would give every dead URL the home
// page's title, canonical and `index, follow`. Own title, no canonical, noindex.
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

// From the same `routes` array as the shells, so the two cannot disagree. No <lastmod>:
// it would be the build date on every entry.
const urls = ['/', ...routes.map((m) => m.path)]
  .map((p) => `  <url><loc>${SITE}${p}</loc></url>`)
  .join('\n')
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
)

// Only the sitemaps scripts/profile.js records as returning XML. They are on sibling
// subdomains, so these are hints: a cross-domain Sitemap directive may be ignored, and
// each site serves its own robots.txt naming its own sitemap.
const sitemaps = profile.sites.filter((s) => s.sitemap)
const skipped = profile.sites.filter((s) => !s.sitemap)
writeFileSync(
  'dist/robots.txt',
  [
    `# ${profile.site.replace('https://', '')}`,
    `# ${profile.name}, ${profile.jobTitle}`,
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

// A convention rather than a standard, and cheap either way. `section()` returns null
// rather than '' for an empty group, because the filter below would otherwise drop the
// blank lines that separate the rest.
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

// scripts/profile.js verbatim, served over HTTP so other repositories and tooling can
// read these facts without vendoring them.
writeFileSync('dist/profile.json', JSON.stringify(profile, null, 2) + '\n')

console.log(
  `✅ ${routes.length} routes, 404.html, sitemap.xml (${urls.split('\n').length} URLs), ` +
    `robots.txt (${sitemaps.length} sitemaps), llms.txt, profile.json, all from scripts/profile.js`
)
