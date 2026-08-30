# The CV

One HTML file per variant, rendered to PDF during the site build. No PDF is committed,
and none is edited by hand.

```bash
npm run cv      # just the PDFs
npm run build   # the site, PDFs included
```

## The one thing to be clear about first

**A static host serves its output directory to the internet. That is what a static host
is.** Cloudflare Pages, AWS, GitHub Pages: `dist/` *is* the website, and every file in it
is fetchable by anybody who knows or guesses the URL. Making this repository private
changes who can read the source. It changes nothing about who can read the deployed site.

So there is no arrangement where a link can be pasted into an application form and also
not be reachable by whoever reads that form. A link is a link.

What can be arranged is **unlisted and unguessable**, which is what this does:

- nothing on the site links to it
- it is in no sitemap and no robots.txt
- one segment of its path is a secret string

That defeats the threat that actually exists, which is crawlers and idle browsing. It does
not defeat somebody who has been given the link, and it is not meant to: that is the same
guarantee as attaching the PDF to an email, which is the thing it replaces.

Note also what is being protected. **The phone number, not the CV.** The public CV is
readable by anyone and always was; anyone who wants to copy its wording can already do so.

## What gets built

| URL | Linked from | Private fields |
|---|---|---|
| `ibtisam-iq.com/cv.pdf` | the navbar, which is currently commented out | removed |
| `ibtisam-iq.com/cv` | nothing, it is for typing | forwards to `/cv.pdf` |
| `ibtisam-iq.com/cv/<id>-<derived>` | nothing | included |

`/cv` exists because it is what a person types, and what can be read down a phone. A static
host resolves it to `/cv/` and serves the index there, which forwards to `/cv.pdf`.

That index file is written on **every** build, including one with no secret. It also
suppresses directory listing on `/cv/`, which is the job it was added for, and those two
jobs must not be tied together: gated on the private build, `/cv` would 404 on every fork,
every pull request, and any deploy where `CV_SECRET` is missing. That is precisely the case
nobody would think to test.

## Reading that second URL

```
ibtisam-iq.com/cv/kubernetes-0000bbbb2222
                └┬┘ └───┬────┘ └────┬────┘
                 │      │           │
      what the link is  │      the protection
        public, fixed   │      unguessable, different for every CV
                   which CV
                   public, readable
```

**`cv` is public and says so.** A recruiter reading the link before clicking can see that
it is a CV, which was the point of `/cv.pdf` and should not be lost. Naming this directory
costs nothing: it sits in a public repository either way and was never the protection.

**The role is public** because it is a description rather than a key.

**The trailing string is the protection.** It is not stored. It is computed:

```
segment = HMAC-SHA256(master secret, variant name), first 12 hex characters
```

### Why derived rather than one shared slug

The obvious design is one random slug shared by every CV, as `/cv/<slug>/kubernetes`. It
does not survive contact with a recruiter. Handing out that link hands over the shared
slug, and `aws`, `sre` and `platform` are then one guess each; `/cv/<slug>` gives up the
general CV with no guessing at all. One recipient can enumerate everything.

Two properties are wanted, and a shared slug can only have one:

- one secret to keep and rotate
- knowing one variant's URL reveals nothing about another's

HMAC gives both, because it cannot be run backwards. A recipient cannot get from their
segment to the master secret, so cannot get forwards to any other variant. Verified by
building four variants and trying the substitutions from a recipient's position: every one
of `aws-`, `sre-`, `platform-`, `devops-` and `general-` against a known tail returns 404,
as does the bare tail on its own.

It also means **the master secret never appears in a URL.** What gets handed out is derived
from it, so sharing a link does not share the key.

Twelve hex characters is 48 bits. Not brute-forceable over HTTP against a host that answers
a wrong guess with a 404 and nothing else.

## Why the short link exists

`ibtisam-iq.com/cv/<id>-<derived>` opens
`ibtisam-iq.com/cv/<id>-<derived>/<Name>-<Role>-CV-<Mon-YYYY>.pdf`.

The indirection is not decoration. The filename carries the build month, so it changes
when the month does, and a link pasted straight at the PDF in July is a 404 in September.
The short link is stable and always resolves to whatever is current.

One mechanism, not two: an `index.html` in each variant's directory, containing a meta
refresh. It works on every host.

**There is deliberately no `_redirects` file**, which is worth saying because writing one
is the obvious next step and it is a trap. Cloudflare and Netlify would consume it and
turn the short link into a real 302, which is tidier. GitHub Pages does not consume it, it
serves it as a plain text file at `/_redirects`, a well known name. To redirect the link,
that file has to contain the link. So on the host this site is on today, writing
`_redirects` would publish the secret to anybody who asked for it.

A mechanism that protects the URL on one host and hands it out on another is worse than
not having it.

## One variant, two forms

Worth separating, because it is easy to read the list as one entry per PDF.

```
{ id: 'general', file: 'cv.html', alsoPublic: true }
        │             │                  │
        │        one HTML file           │
   ┌────┴────────────────────────────────┴─────┐
   │                                           │
PRIVATE form                             PUBLIC form
always built                        only when alsoPublic
phone: yes                                phone: no
"General CV." line: no          "General CV." line: yes
/cv/general-<derived>                       /cv.pdf
needs the secret                     no secret involved
```

`alsoPublic` is not a second variant. It is a flag on this one meaning "also render a
public form". The public form has no derived segment, because it is not protecting
anything.

## The filename

Nothing in it is typed into the build script:

| Part | Comes from |
|---|---|
| `Muhammad-Ibtisam-Iqbal` | the `<h1>` of that variant's HTML |
| `DevOps-Cloud-Engineer` | its `.subtitle` |
| `Aug-2026` | the clock, at build time |

So a variant whose subtitle reads `AWS Platform Engineer` is named
`Muhammad-Ibtisam-Iqbal-AWS-Platform-Engineer-CV-<Mon-YYYY>.pdf` without `cv/build-pdf.mjs`
knowing that the role exists. Changing a job title in the HTML changes the filename with
it, and the short link keeps working either way.

It is long because it is the one a person downloads and keeps, and a short generic name in
somebody's downloads folder is a file they cannot identify a month later.

## Which link is sent

The build prints it:

```bash
npm run cv
```

```
  Hand these out. Anyone with one can read that CV, and only that one.

    general     https://ibtisam-iq.com/cv/general-0000aaaa1111
    kubernetes  https://ibtisam-iq.com/cv/kubernetes-0000bbbb2222

    public      https://ibtisam-iq.com/cv.pdf  (no phone number, safe to link publicly)
```

One line per active entry in `VARIANTS`, so today there is one private link, because there
is one CV. The Kubernetes and AWS lines are commented out, so those links do not exist yet.
Writing the HTML file and uncommenting its line is what brings one into being.

The links are not written down anywhere, in this repository or outside it. They are
computed from the secret at build time, so this command is the only way to read them.

### Testing a link locally

Not on the dev server. `npm run dev` answers every unknown path with the React app, so
`/cv/<segment>` renders the site shell and a blank page rather than the PDF. That is Vite's
single page app fallback and it says nothing about whether the link works.

Test the built site instead, which is what a host actually serves:

```bash
npm run build
python3 -m http.server 8000 --directory dist
```

Then open `http://localhost:8000/cv/<segment>`.

**Not printed on CI.** GitHub Actions logs are readable by anyone who can read the
repository, and a printed link is a working link. That is the same mistake as committing
one, with a slower fuse.

## Configuration

Locally, `cv/private.local.json`, gitignored:

```json
{ "phone": "+92 3XX XXXXXXX", "secret": "PUT-A-LONG-RANDOM-STRING-HERE" }
```

On CI, two repository secrets: `CV_PHONE` and `CV_SECRET`. Without them the build
still succeeds and emits only the public CV, which is what every fork and every pull
request gets.

### Choosing the secret

Generate it, do not invent it. This writes it straight into the config, so it never appears
on screen and cannot be pasted anywhere by accident:

```bash
node -e 'const f="cv/private.local.json",fs=require("fs"),d=JSON.parse(fs.readFileSync(f));d.secret=require("crypto").randomBytes(32).toString("hex");fs.writeFileSync(f,JSON.stringify(d,null,2));console.log("new secret written")'
```

- **Never let it reach a screen outside this machine.** Not a chat, not an issue, not a CI log.
  `openssl rand -hex 32` works too, but it prints to the terminal, and a value that has
  been printed is a value that gets pasted. The command above avoids the problem rather than
  relying on remembering it.
- **Random, not a word.** It is a key, and it is the only one.
- **Length is not a constraint.** It never appears in a URL, so nobody types it. 32 bytes.
- **Never reused anywhere else**, and never written into a commit, a README, `robots.txt`
  or a sitemap.

**Changing it breaks every link already handed out**, for every variant, because all of
them are derived from it. Rotate deliberately, when a link has gone somewhere it should
not have.

**The old directory is removed automatically.** `cv/build-pdf.mjs` deletes any directory under
`public/cv/` that the current secret does not produce, before it writes its own, so the next
build after a rotation retires the old link. It prints `removed a superseded CV directory`
without the name, because the name is the secret.

This used to be a manual second step, and it was missed: a directory built from a replaced
secret sat in `public/` and in `dist/` for two days. `public/` is copied into `dist/`
verbatim, so a build and a deploy would have published a live URL for exactly the CV the
rotation was meant to retire, phone number included. A safety step that depends on being
remembered is not a safety step.

`dist/` is not pruned, because the build rewrites it. If a stale directory is ever suspected
there, delete it and rebuild:

```bash
rm -rf dist/cv && npm run build
```

CI is not affected either way. It checks out clean, is given no CV secret, and
`.github/workflows/ci.yml` fails the build if a private tree is present at all.

**Nothing derived from it may be written down here either.** A derived value is a working
URL, so publishing one publishes that CV exactly as publishing the master would publish all
of them. Every example in this file is fake.

**Neither is written into `robots.txt`.** robots.txt is public, so listing a secret path
there is how secret paths get discovered. `public/_headers` is generated at build
time rather than committed for the same reason; it sets `X-Robots-Tag: noindex` on the
directory, which Cloudflare and Netlify honour and GitHub Pages ignores.

## Why nothing is committed

A committed PDF is a permanent one: git history keeps it after any later deletion, which
is the one place a phone number cannot be taken back out of. It would also mean the
deployed CV is whatever was last committed rather than whatever the source says.

The PDFs are built inside `npm run generate`, land in `public/`, and reach `dist/` from
there.

`.github/workflows/cv.yml` is a pull-request check. It renders the public CV and fails if
the PDF is empty, if a phone number reached it, or if it lost its `General CV` line. The
first two are the obvious direction. The third is the other one: that line is the only
thing telling a recruiter with a narrow role that a focused CV exists, and it is added by a
`data-public-only` attribute that an edit to the strip logic could silently remove from
every build.

## Every place the private CV is kept out

The secret is one string, but there is no single place that protects it. Each of these is a
boundary it could cross, and each is closed separately. Every leak so far has been a
routine action taken near the private tree rather than mishandling of the secret itself, so
the list matters more than the principle.

| Boundary | What stops it | What happens without it |
|---|---|---|
| git | `.gitignore`: `*.pdf` anywhere, and `**/cv/*-<twelve hex>/` anywhere | a commit is permanent, and the phone number survives any later deletion |
| Docker images | `.dockerignore`: `public/cv/` and `public/_headers` | `COPY public ./public` takes the working tree as it stands, baking the private CV into an image pushed to Docker Hub |
| the image build | `.github/workflows/ci.yml` runs `npm run generate` with no CV secrets, and fails if a private tree is in the context | the same exposure by a different route |
| CI logs | `cv/build-pdf.mjs` prints no links when `CI` or `GITHUB_ACTIONS` is set | Actions logs are readable by anyone who can read the repository, and a printed link is a working link |
| crawlers | nothing links to it, it is in no sitemap, and `_headers` sets `X-Robots-Tag: noindex` on `/cv/*` | the unguessable URL becomes a search result |
| directory listing | `public/cv/index.html`, written on every build | a host with autoindex enabled answers `/cv/` with a listing of every segment |
| this file | every URL in it is fake | a derived value is a working URL, so an example publishes a CV |

Note the two gitignore patterns are matched **anywhere**, not under `public/`. The narrower
rules were correct about where these files are supposed to live and useless against where
they turn up: a stray `cp -R public somewhere/` puts a copy of the private CV at a path
nothing was watching. That has happened.

## Why the CV is not built inside the Docker image

`Dockerfile` runs `npm run build --ignore-scripts`, which skips the `prebuild` hook. So the
image compiles what is already in the build context and generates nothing itself. Three
reasons, and the first is fatal on its own:

1. The base is `node:22.14-alpine3.21`. Puppeteer's bundled Chromium is glibc-linked and
   does not run on musl.
2. `generate` reads the GitHub and Docker Hub APIs, so it would need network and a token at
   build time and would give different output on every rebuild of the same commit.
3. Its outputs, `src/data/*.ts` and `public/cv.pdf`, are copied in anyway.

So `generate` runs once outside: `.github/workflows/ci.yml` does it on the runner before `docker build`, and
locally `npm run generate` does it before an image is built by hand. **Skip it and the
image ships without a CV**, because `public/cv.pdf` is gitignored and a fresh checkout does
not have one. `.github/workflows/ci.yml` fails the build if `public/cv.pdf` is missing, for exactly that
reason.

`cv/**` is deliberately absent from `.github/workflows/ci.yml`'s `paths-ignore`. It used to be there, back
when `.github/workflows/cv.yml` committed `public/cv.pdf` and that commit triggered the image build by
touching `public/`. Nothing is committed now, so a CV change would otherwise never reach
the image.

## Adding a private field

A slot in the HTML, a value under the same key in the config:

```html
<span data-private-group>
  <span class="separator">|</span>
  <span data-private="phone"></span>
</span>
```

`data-private` names the key. `data-private-group` is what gets removed when the field is
absent, so a separator does not outlive the field it belonged to.

## Adding something the public CV alone should say

The mirror of the above. Mark it `data-public-only` and every private and role-specific
build strips it:

```html
<div class="general-note" data-public-only>
  General CV. A version written for a specific role is available on request.
</div>
```

That line exists so a recruiter hiring for one narrow role does not read the public CV,
decide it is not a match, and leave. It is not a watermark and should not become one. A
diagonal `PUBLIC COPY` stamp is the visual language of *draft* and *void*, it can break the
text extraction an applicant tracking system runs before any person reads the file, and
"public copy" tells the reader something is being withheld from them. "General" says the
opposite, from the same fact: broad coverage, and focus available for the asking.

It is on the public CV only because a CV sent for a named role must not announce itself as
the general one.

## Adding a role-specific CV

Write `cv/cv-kubernetes.html`, then uncomment its line in `VARIANTS` in `cv/build-pdf.mjs`.
Two are already there waiting:

```js
const VARIANTS = [
  { id: 'general', file: 'cv.html', alsoPublic: true },

  // { id: 'kubernetes', file: 'cv-kubernetes.html' },
  // { id: 'aws', file: 'cv-aws.html' },
]
```

For a role that is not one of those two, add a line in the same shape.

`id` is the readable half of the URL, so write it the way it should read in a link. Every
variant has one, the general CV included. A bare twelve character hex string tells its
reader nothing, and its reader is a recruiter deciding whether the link is worth opening.

`id` is also what the segment is derived from, so renaming one changes that variant's link
and leaves every other variant untouched.

No `alsoPublic` means no public form. A role-specific CV is for sending to a named
employer; it has no business on the open site.

Each variant gets its own segment from the one master secret:

```
ibtisam-iq.com/cv/general-0000aaaa1111      the general CV
ibtisam-iq.com/cv/kubernetes-0000bbbb2222   the Kubernetes one
ibtisam-iq.com/cv/aws-0000cccc3333          the AWS one
ibtisam-iq.com/cv/sre-0000dddd4444          the SRE one
```

The trailing strings above are deliberately fake and are not valid for any secret. They
show the shape only. **No value derived from the real master secret may be written into
this repository**, because a derived value is a working URL: publishing one publishes that
CV, exactly as publishing the master would publish all of them.

A recipient of any one of them can reach that one and nothing else.

### When there are three or four of them

Four HTML files agree on the day they are written and disagree a month later. At that
point the projects section should stop being hand-written and start being generated from
`data/projects.yaml` in the projects repo, which is already the single source of truth the
portfolio site reads at build time. A variant then becomes a filter over that data rather
than a copy of the document:

```js
{ id: 'kubernetes', include: ['microservices-demo', 'debugbox', 'retail-store'] }
```

Everything outside the projects section stays shared, so a change to the summary or the
skills list lands in every CV at once.

Worth doing when the second CV exists. Not before: one variant does not need a variant
system, and building it early would be guessing at what the variants need to differ on.

## Keep the public CV wide

With no employment history to anchor a specialisation, narrowing the public document
closes doors that the private role-specific copies can open one at a time.
