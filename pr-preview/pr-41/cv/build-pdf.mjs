// Renders the CV to PDF, in a public form and in private per-variant forms behind
// unguessable URLs. Run with `npm run cv`, and from `npm run generate`.

import puppeteer from 'puppeteer'
import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync, rmSync } from 'fs'
import { createHmac } from 'crypto'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

/**
 * A private variant lives at `<role>-HMAC(CV_SECRET, role)`: unlisted and unguessable, not
 * secret. A deployed file is a public URL, and what this protects is the phone number.
 * cv/README.md has the threat model and the rotation procedure. Read it before editing.
 */

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
const privateConfigPath = join(__dirname, 'private.local.json')

/**
 * One entry per HTML file. `id` is the readable half of that variant's URL, so write it as
 * it should read in a link. `alsoPublic` marks the one variant with a public form: a
 * role-specific CV is for a named employer and has no business on the open site.
 */
const VARIANTS = [
  { id: 'general', file: 'cv.html', alsoPublic: true },

  // Uncomment once the HTML file exists; its `.subtitle` becomes the PDF filename.
  // { id: 'kubernetes', file: 'cv-kubernetes.html' },
  // { id: 'aws', file: 'cv-aws.html' },
]

const local = existsSync(privateConfigPath)
  ? JSON.parse(readFileSync(privateConfigPath, 'utf8'))
  : {}

const privateFields = { phone: process.env.CV_PHONE ?? local.phone ?? null }
const masterSecret = process.env.CV_SECRET ?? local.secret ?? null
const buildsPrivate = Boolean(masterSecret && Object.values(privateFields).some(Boolean))

if (!buildsPrivate) {
  console.log('  no CV_SECRET or private fields, so only the public CV is built')
}

// Fixed and public. It says what the link is for; the derived half of the segment under
// it is what keeps it private. Naming it `cv` costs nothing: a directory name in a public
// repository was never part of the secret.
const PRIVATE_ROOT = 'cv'

// Only used to print a copy-pasteable link at the end of a local build.
const SITE = 'https://ibtisam-iq.com'

const MONTH = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' })
const kebab = (s) => s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '')

/**
 * The one path segment a variant lives at. Twelve hex characters is 48 bits, and the role
 * is prefixed in the clear because it is a description, not a key. The id is the HMAC
 * input, so renaming a variant changes only that variant's link.
 */
const segmentFor = (variant) => {
  const derived = createHmac('sha256', masterSecret)
    .update(variant.id)
    .digest('hex')
    .slice(0, 12)
  return `${variant.id}-${derived}`
}

const urlFor = (variant) => `/${PRIVATE_ROOT}/${segmentFor(variant)}`

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

async function render({ file, fields, isPublic = false, outputPath }) {
  const page = await browser.newPage()
  await page.goto(`file://${join(__dirname, file)}`, { waitUntil: 'networkidle0' })

  const meta = await page.evaluate((values, isPublic) => {
    // The mirror of data-private: content only the public CV carries. It is the one a
    // stranger finds unaided, so it is the only one that has to say what it is.
    if (!isPublic) {
      document.querySelectorAll('[data-public-only]').forEach((el) => el.remove())
    }

    document.querySelectorAll('[data-private]').forEach((el) => {
      const value = values ? values[el.dataset.private] : null
      if (value) {
        el.textContent = value
      } else {
        // Removes the separator with the field, so the contact row does not end up with
        // two pipes side by side.
        ;(el.closest('[data-private-group]') ?? el).remove()
      }
    })
    return {
      name: document.querySelector('h1')?.textContent?.trim() ?? 'CV',
      role: document.querySelector('.subtitle')?.textContent?.trim() ?? '',
    }
  }, fields, isPublic)

  const path = outputPath(meta)
  mkdirSync(dirname(path), { recursive: true })
  await page.pdf({
    path,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  })
  await page.close()
  return path
}

const written = []
const shortLinks = []

for (const variant of VARIANTS) {
  if (variant.alsoPublic) {
    written.push(
      await render({
        file: variant.file,
        fields: null,
        isPublic: true,
        outputPath: () => join(publicDir, 'cv.pdf'),
      })
    )
  }

  if (buildsPrivate) {
    const dir = join(publicDir, PRIVATE_ROOT, segmentFor(variant))
    const path = await render({
      file: variant.file,
      fields: privateFields,
      outputPath: (meta) =>
        join(
          dir,
          `${kebab(meta.name)}-${kebab(meta.role)}-CV-${kebab(MONTH.format(new Date()))}.pdf`
        ),
    })
    written.push(path)
    shortLinks.push({ dir, url: urlFor(variant), file: path.split('/').pop() })
  }
}

await browser.close()

// Generated at build time rather than committed, because these files either name the
// secret directory or only exist when there is one.
if (buildsPrivate) {
  for (const { dir, file } of shortLinks) {
    // A meta refresh, not a header: GitHub Pages serves no redirects. The visible link is
    // the fallback for a browser that blocks the refresh.
    writeFileSync(
      join(dir, 'index.html'),
      `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta http-equiv="refresh" content="0; url=${encodeURI(file)}">
<title>Muhammad Ibtisam Iqbal, CV</title>
<link rel="canonical" href="${encodeURI(file)}">
<style>
  body{font:15px/1.6 system-ui,sans-serif;margin:0;min-height:100vh;display:grid;
       place-items:center;background:#0B0F19;color:#9aa4b0;padding:24px;text-align:center}
  a{color:#00b4d8}
</style>
</head>
<body>
  <p>Opening the CV. <a href="${encodeURI(file)}">Download it directly</a> if nothing happens.</p>
</body>
</html>
`
    )
  }

  // Never add a _redirects file. Cloudflare and Netlify consume it; GitHub Pages serves it
  // as plain text at a well known name, so redirecting the short link would mean publishing
  // that link to anyone who asks. The meta refresh works on every host.

  // Honoured by Cloudflare and Netlify, ignored by GitHub Pages. Names only `/cv/*`, which
  // is public, so unlike _redirects this one is safe to publish wherever it lands.
  writeFileSync(
    join(publicDir, '_headers'),
    [
      `/${PRIVATE_ROOT}/*`,
      '  X-Robots-Tag: noindex, nofollow, noarchive',
      '  Cache-Control: no-store',
      '',
    ].join('\n')
  )

}

// Remove any segment the current secret does not produce, or a rotated-away CV stays on
// disk and Vite copies it into dist/. The directory name is never printed: it is the secret.
const wanted = new Set(buildsPrivate ? VARIANTS.map(segmentFor) : [])
const privateRoot = join(publicDir, PRIVATE_ROOT)
if (existsSync(privateRoot)) {
  for (const entry of readdirSync(privateRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || wanted.has(entry.name)) continue
    rmSync(join(privateRoot, entry.name), { recursive: true, force: true })
    console.log('  removed a superseded CV directory')
  }
}

/**
 * public/cv/index.html. Two jobs: it makes `/cv` resolve to the public PDF, and it stops a
 * host with autoindex enabled from answering a request for /cv/ with a listing of every
 * variant's segment. Written unconditionally, or `/cv` 404s on every fork and pull request.
 */
mkdirSync(join(publicDir, PRIVATE_ROOT), { recursive: true })
writeFileSync(
  join(publicDir, PRIVATE_ROOT, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<meta http-equiv="refresh" content="0; url=/cv.pdf">
<title>Muhammad Ibtisam Iqbal, CV</title>
<link rel="canonical" href="/cv.pdf">
<style>
  body{font:15px/1.6 system-ui,sans-serif;margin:0;min-height:100vh;display:grid;
       place-items:center;background:#0B0F19;color:#9aa4b0;padding:24px;text-align:center}
  a{color:#00b4d8}
</style>
</head>
<body>
  <p>Opening the CV. <a href="/cv.pdf">Download it directly</a> if nothing happens.</p>
</body>
</html>
`
)

for (const path of written) {
  console.log(`  wrote ${path.replace(join(__dirname, '..'), '.')}`)
}

/**
 * The links, printed, because they are computed rather than stored and exist nowhere a
 * person can read them. Never on CI: this repository is public, so its Actions logs are,
 * and printing a working URL there publishes it.
 */
if (buildsPrivate) {
  const onCI = Boolean(process.env.CI ?? process.env.GITHUB_ACTIONS)
  if (onCI) {
    console.log(`\n  ${shortLinks.length} unlisted CV(s) built. Links not printed on CI.`)
  } else {
    const width = Math.max(6, ...VARIANTS.map((v) => v.id.length))
    console.log('\n  Hand these out. Anyone with one can read that CV, and only that one.\n')
    // urlFor rather than shortLinks[i]: the two arrays only line up because shortLinks is
    // filled once per variant, and that is a coupling a future early-continue would break
    // silently, printing one variant's link under another's name.
    for (const variant of VARIANTS) {
      console.log(`    ${variant.id.padEnd(width)}  ${SITE}${urlFor(variant)}`)
    }
    console.log(
      `\n    ${'public'.padEnd(width)}  ${SITE}/cv.pdf  (no phone number, safe to link publicly)\n`
    )
  }
}
