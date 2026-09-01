# Reference

What every part of this repository is, and why it was built the way it was.

The code itself carries only the reasoning a future edit could break. Everything else that
is worth knowing lives here: the measurements behind a decision, the approach that was
tried and rejected, and the mistake that set a rule. Nothing in this file is a rule the
code does not already follow.

The root `README.md` introduces the project. This file explains it.

---

## 1. What this is

A portfolio site at `ibtisam-iq.com`, built with React, TypeScript, Vite and Tailwind CSS,
and published two ways from the same output: as a static site on GitHub Pages, and as an
nginx container image.

Its governing idea is that every claim on it can be checked. The number of Docker pulls,
the number of projects, the tools that appear on the tools page, the contribution graph,
the size of a container image: none of these is typed in by hand. Each is read from a
source that can be inspected, written into a file at build time, and shown with a note
saying where it came from and when it was measured.

That idea is the reason for most of what follows. A site that derives its own content needs
scripts to derive it, checks to prove the derivation is sound, and a rule about what may be
said without evidence.

---

## 2. Running it

```bash
npm install
npm run dev          # generates data, then starts the dev server
npm run build        # generates data, compiles, and prerenders metadata into dist/
npm run lint         # ESLint
npm run check:prose  # the writing rules for comments and documents
npm run check:contrast   # colour contrast, in a real browser, against dist/
npm run cv           # renders the CV to PDF
```

`npm run generate` runs automatically before both `dev` and `build`. It reaches the
network. A clone with no network still builds, because every generated file is committed
alongside the code.

---

## 3. Where the numbers come from

Five scripts run before every build, on a laptop and on a CI runner alike. Each reads a
source it does not own and writes a TypeScript module the site imports.

| Script | Source | Output |
| --- | --- | --- |
| `scripts/generate-from-projects.js` | the projects repository | `src/data/generated.ts` |
| `scripts/generate-debugbox.js` | the DebugBox README | `src/data/debugbox.ts` |
| `scripts/generate-stats.js` | Docker Hub and the GitHub API | `src/data/stats.ts` |
| `scripts/generate-contributions.js` | the GitHub contributions fragment | `src/data/contributions.ts` |
| `cv/build-pdf.mjs` | `cv/cv.html` | `public/cv.pdf` and the private variants |

The two upstream repositories are public and can be read directly:

- https://github.com/ibtisam-iq/projects
- https://github.com/ibtisam-iq/debugbox

The generated files are committed as well as generated. A fresh clone type-checks offline,
and a change upstream arrives as a diff somebody can review rather than as a silent
difference between two builds of the same commit.

Three data files are maintained by hand, because nothing measures what they hold:
`src/data/availability.ts`, `src/data/certificates.ts` and `src/data/terminal.ts`.

### The tools page draws its own boundary

The projects repository holds a taxonomy: which technologies exist, which domain each
belongs to, and which are meant to be shown. `scripts/generate-from-projects.js` reads that
taxonomy and the project list together, and a technology only reaches the site if some
project actually uses it. A taxonomy entry nothing uses is a name reserved for later, not a
claim.

A second, much smaller list lives in the generator itself: tools known from training that
no published project demonstrates. They are shown as such and never counted as evidenced.

That list is kept short for a reason worth recording. On 27 August 2026 it held seven
entries, five of which had never been used. They had arrived through generated content,
been written into a notes file, and been carried onto the site from there. A single
unfounded claim discredits the evidenced tier as well, so an entry is added only for
something genuinely used or studied.

### The contribution graph is scraped, deliberately

Two alternatives were measured and rejected.

A third-party chart image would put a request to somebody else's host on a page that
otherwise loads nothing external, and hand that host the visitor list.

GitHub's GraphQL API needs an authenticated token, which means the script goes quiet during
local development and depends on a permission that cannot be tested from a laptop.

The HTML fragment GitHub's own profile page loads needs neither. It was compared against
GraphQL for the same account on two separate days, before and after an account change that
moved every number: same day count, same total, same value in every cell.

Parsing somebody else's markup is a real liability, so the parse proves itself against the
total GitHub prints above the grid. If it cannot, the reading is discarded and the
previously committed file stands.

That check is a bound rather than an equality, and the difference took a day to find. The
heading and the grid do not always cover the same window. The grid is week-aligned and
drops its oldest week on a Sunday; the heading keeps counting those days for a while
longer. On 30 August 2026 the heading read 3,284 against a grid summing to 3,208, and the
76 missing contributions were exactly the seven days the grid had just dropped. An equality
check calls that a parse failure once a week. An explicit date range would settle it and is
not available: GitHub ignores a range that crosses a year boundary and answers with that
calendar year instead.

The figure the site prints is the sum of the cells, not the heading, so a reader who adds
up the squares arrives at the number above them.

---

## 4. The design system

Two files hold it: `tailwind.config.js` names the colours and the type, and `src/index.css`
defines the surfaces, the containers and the label roles that every page composes from.

### One accent, in two values

The site had a purple accent and a teal one. It has teal only. That teal exists in two
values because a single hue cannot clear the contrast requirement on both a near-black and
a white background: the dark value measures 8.03:1 on the dark page and 2.46:1 on white.
The light value is the same hue darkened until it clears everywhere it is used.

Both live in one CSS variable, set per theme. Anything painting the accent reads that
variable. A rule that spells a hex value out is correct in one theme and broken in the
other, which is a mistake this site has made more than once, most consequentially on the
keyboard focus ring.

### The palette is neutral by construction

The previous palette was GitHub's dark-dimmed, inherited early and never revisited. Its
background is a navy at 39% saturation, its card colour at 40%. Ibtisam described the
result exactly without the vocabulary for it: the background did not read as black, and the
card colour was not a colour he could name. That is what a 39% navy at 7% lightness does.
It is too dark to register as blue and too tinted to register as black, so the eye senses a
cast it cannot place.

The first replacement used values that look neutral and are not: they measured 10 to 13%
saturation, and the faintest text tier fell to 4.43:1. The rule that came out of it is that
red, green and blue must be equal, or it is not a neutral.

### Contrast is published, and therefore checked

Every text tier was measured against every surface it can land on. Published numbers are
only worth having if something checks them: the palette before this one carried a token at
2.31:1 for months because nothing did.

| Theme | Tier | Page | Card | Raised |
| --- | --- | --- | --- | --- |
| dark | primary | 18.97 | 17.95 | 16.67 |
| dark | muted | 7.85 | 7.43 | 6.90 |
| dark | faint | 5.73 | 5.43 | 5.04 |
| light | text | 19.80 | 18.97 | 18.00 |
| light | muted | 6.69 | 6.41 | 6.08 |
| light | faint | 5.02 | 4.81 | 4.57 |

Every one clears 4.5:1. Lightening a tier, or changing a surface, invalidates the whole
table: rerun `npm run check:contrast`.

One failure is worth recording, because the excuse for it was written into the code. The
light faint tier read 4.31:1 against a raised card, and the comment excused it as clearing
the 3:1 bar for large text. That is the wrong bar. 3:1 applies at 24px, or 18.66px bold,
and all three places the value landed were 13px.

The excuse survived because the contrast script could not see those nodes at all. It
selected elements and skipped any that had element children, so plain text inside a
paragraph containing a link was never measured, which was about 12% of the text on the
site. The script walks text nodes now, and the value is dark enough that no surface can
take it below 4.5:1.

### Three surface levels, and one frame

Sunk, raised and the page are the whole scale, named as `.well`, `.panel` and the page
background. Before they were named the site used five different surface tokens and two raw
hex values across eleven files, with no rule about which meant what, so a command row
inside a panel was flat and dark while the panel around it was raised and glassy. That is
one design applied twice from memory.

Depth on a raised surface is three things together: a hairline lighter than the border
along the top edge, a shadow with a long soft falloff, and a background that is not quite
opaque. The highlight is the part usually left out and the part that does the work.

In light mode none of that survives. Composited and measured, a light panel was a fill that
resolves to pure white over a white page, an inset highlight of white painted onto white,
and shadows at a fraction of the dark theme's opacity. A 1px border was carrying the entire
effect. Light mode's depth is now the shadow, in three stops rather than one, because a
single blur reads as a drop shadow and a stack reads as an object above a surface.

`.page-frame` is the one container. The site previously had five container widths, four
horizontal padding scales and two alignments. At a 1280px viewport the first character of
body text sat at 104px on the homepage, 128px on the tools page, and 192px on
certifications and about. Nothing was wrong with any one of those numbers. What was wrong
was that there were four of them, so moving between pages felt like moving between sites.

### The vertical rhythm is a half-gap

`.section-y` is 64px at desktop, and adjacent sections stack their padding, so the space
between two sections is 128px. The ladder is 24 for a card gap, 40 under a section heading,
64 at the page edge, 128 between sections.

It was 40 before the palette pass and 80 after, which overshot toward the idea that premium
means more air. At 80 the gap between sections is 160px, and the sections here are short: a
heading and one panel. A 160px moat around each is what made the about page read as three
separate things rather than one page.

### Two eyebrows became one

There were two treatments for the small label above a title: one muted for pages, one
coloured for sections, on the theory that a page title's heading already does the
announcing. The theory broke when a section moved from the homepage to the about page. That
page then had a muted label above its heading and a coloured one below it, so a subsection
was louder than the page containing it. Muting the subsection would have fixed the symptom.
Deleting the category fixed the cause: the size difference between a page heading and a
section heading already says which is which.

### Figures have two sizes, and no third

An audit found every real figure set between 11 and 14px while the largest numerals on the
homepage were decorative step numbers at 40px. The hierarchy was arguing against the
content. The fix is not "bigger", it is a fixed set of sizes, because enlarging everything
ranks nothing. `src/components/StatFigure.tsx` allows two, and anything smaller is body
text.

### Why the tools carry letters instead of logos

Logos were the obvious choice and were measured rather than argued about. The icon set
already bundled with the site ships 3,446 marks, so logos would have cost no new assets.
Only 41 of the 71 tools have one, even after a hand-written alias map.

The gap is not spread evenly. The icon set removed almost every AWS service mark over
trademark policy, so one category lands at 2 of 9 while another lands at 7 of 8. A grid 88%
complete in one category and 22% in the next reads as broken rather than sparse, and the
22% category is the one carrying the subject matter of both certifications.

`src/lib/monogram.ts` derives two or three letters and a hue from each name instead. That
covers all 71, needs no assets, raises no trademark question, and is stable, so a reader who
learns a mark keeps it. The hue is the only thing that varies; saturation and lightness are
fixed per theme, which is what keeps 71 marks reading as one system rather than as 71
unrelated colours.

The same file explains why the tools grid sorts on the name with the vendor prefix removed.
The mark on a tile is built from that shortened name, so a grid sorted on the full name
showed a reader EKS, CM and IAM and then ordered them under A-m-a-z-o-n and A-W-S. The mark
said the prefix does not matter and the order said it decided everything.

---

## 5. The interface

### Structure

`src/main.tsx` mounts the application. `src/App.tsx` holds the router and the shell every
page renders inside: the header, the skip link, the error boundary and the footer. It is the
only definition of what pages exist, and two checks read it rather than keeping a second
list.

`src/components/` holds the parts. `src/pages/` holds the five routes. `src/lib/` and
`src/hooks/` hold small pieces with no opinion about how they look.

### The parts worth knowing about

`src/components/StatFigure.tsx` renders a measured number and the band that lays a row of
them out. The band is a 1px grid gap over a coloured backdrop, so the gaps are the dividers
and no cell needs a border to line up. The backdrop fades at both ends, which stops every
divider short of the edge in a single gradient.

`src/components/Tooltip.tsx` replaces the browser's own tooltip, which is unstyleable, about
a second late, wrapped however the platform likes, and unreachable from a keyboard. Every
figure on the site carries its provenance in one, so the most carefully written text here
was being rendered by something with no interest in how it looked.

`src/components/Terminal.tsx` is a real terminal that answers questions from the site's own
data. It replaced a fake one that typed out a fixed string character by character: it looked
like a terminal and answered nothing. `src/data/terminal.ts` holds the commands and the rule
that none of them may simulate infrastructure.

`src/components/AmbientCanvas.tsx` draws the moving particle field behind the hero. Its
opacity is roughly half what it started at. Atmosphere that can be read as a diagram has
stopped being atmosphere, and because it moves it takes the first look on the page, so a
decorative layer is the one thing on a hero that must never compete.

`src/lib/useNow.ts` supplies the clock. It reads time through React's external-store API
rather than an effect, because a clock is something React should be reading rather than
state it owns, and it ticks on the boundary rather than on an interval from mount. A fixed
interval starting at 7:30:45 fires at 7:31:45, so a minute-resolution reading crosses its
boundary at 7:31:00 and nothing re-reads it for another 45 seconds. The clock is then a
visible minute behind the one beside it.

`src/lib/provenance.ts` writes the "where this came from" strings. Its first version
produced sentences like "8 projects, each with a public repo and a runbook. Derived from
the projects repository when this page was built, 28 Aug 2026", which is a website
explaining its own build process to a stranger who asked what a number meant. A reader with
ten seconds wants to know whether the figure can be checked and against whom. It now
produces "Docker Hub, 28 Aug 2026".

### The theme

`public/theme.js` runs blocking in the head and applies the theme before the first paint:
the visitor's stored choice if there is one, otherwise `prefers-color-scheme`.
`src/context/ThemeContext.tsx` then reads the class that script already set, rather than
repeating its logic, so the two cannot disagree, and stores every later change.

The separate file is what prevents a flash. React applies the class after first paint, so
without a script that runs before it, a visitor whose system is set to light sees a dark
page on every load. It is a file rather than an inline block for the reason in the
deployment section: the container's policy would otherwise need a hash of its text.

Writing to storage is wrapped, because a browser with site data blocked throws on write, and
a theme toggle that throws is worse than one that forgets.

---

## 6. Building, publishing and serving

### The build

`npm run build` compiles the TypeScript, has Vite bundle the site into `dist/`, and then
runs `scripts/prerender-meta.js`. That last step writes a separate HTML shell for each
route with its own title, description and canonical URL, plus `404.html`, `sitemap.xml`,
`robots.txt`, `llms.txt` and `profile.json`.

The shells matter because this is a single-page application. A crawler that does not run
JavaScript would otherwise resolve every page back to the site root.

`scripts/profile.js` is the single place identity, credentials and sites are edited.
Everything in the list above is derived from it, and none of those outputs is committed.

### The two deployments

`.github/workflows/pages.yml` builds and publishes to GitHub Pages, which is the live site.
It also builds a preview for every pull request, served under a sub-path.

`.github/workflows/ci.yml` builds and pushes a container image for two architectures. The
`Dockerfile` has three stages and the final one is nginx with no Node in it.

The image builds with data generation disabled, and that is deliberate. The CV renderer
needs a browser that does not run on the Alpine base at all; the data scripts need network
access and a token, and would produce different output on every rebuild of the same commit.
So generation happens once, outside, and the build stage compiles what it produced. The CI
workflow does that on the runner before calling `docker build`, and refuses to continue if
the CV is missing.

`nginx.conf` applies only to the container. GitHub Pages serves the same `dist/` with its
own headers, so a rule added there changes one of the two deployments and not the other.
The policy there permits exactly what the page uses: the analytics tag's host in
`script-src`, its beacon in `connect-src`, and Google Fonts. It permits no inline script,
and `index.html` contains none, because the two scripts that were inline are now
`public/theme.js` and `public/analytics.js`.

That is deliberate and is the reason those files exist. The alternative to a self-hosted
file is a hash of the inline text in the policy, and a hash breaks on any whitespace edit,
silently, in one deployment out of two. Widening `script-src` to `'unsafe-inline'` is not an
option at all, since it defeats the policy it would be written into.

### What must never ship

Two things are excluded everywhere, at every step that copies or publishes a directory.

The phone number, which appears in the private CV variants and not in the public one.

The CV secret, and anything derived from it. A derived value is a working URL to a CV
carrying the phone number, so writing one down publishes that document exactly as writing
the secret down would publish all of them.

The working rule, learned from five separate near-misses, is that anything which copies,
prints or publishes a whole directory or a whole log is a publication step, and the private
tree has to be excluded at each one explicitly. `.gitignore`, `.dockerignore` and both
workflows each carry that exclusion, and `.github/workflows/ci.yml` fails the build if a
private tree is present.

Rotating the secret is covered by the same rule, and by the build rather than by memory.
`cv/build-pdf.mjs` deletes any directory under `public/cv/` that the current secret does not
produce, before writing its own. Without that a rotated-away CV stays on disk and reaches
`dist/` on the next build, which is the case a rotation exists to prevent.

---

## 7. The checks

Three scripts, all runnable locally and all run by CI.

`npm run lint` is ESLint.

`npm run check:contrast` serves the built site to a real headless browser, walks every text
node on every route in both themes, and measures the contrast of each against its composited
background. It also checks the generated tool marks and looks for horizontal overflow at
375px.

Four things about it were wrong in earlier versions and are worth stating.

It runs in a real browser rather than an embedded preview pane. A hidden pane does not
composite, so style recalculation is deferred and the computed style comes back from before
the last change. That reported between 24 and 45 failures per page that did not exist.

It seeds the theme into storage before navigating, then asserts the page is in it. The
version before clicked the theme toggle and waited for the class, which assumed the site
always opened dark. Once the theme began following the operating system, that wait never
resolved on a machine configured for light, and the check hung rather than failing.

It takes its route list from the router rather than from the sitemap. Reading the sitemap is
a restatement, not a check: the sitemap and the prerendered shells come from one array, so
when the router was renamed from `/skills` to `/tools` and that array was not, the sitemap
did not merely miss the page, it advertised a route the application does not have. Both
halves were wrong together, so nothing derived from them could notice.

`npm run check:prose` enforces the writing rules described in the next section.

---

## 8. How this repository is written

Every comment and document here follows one set of rules, and `scripts/check-prose.mjs`
enforces the mechanical half of them with a file and a line number.

Enforced automatically: no em dash anywhere; no second person and no first person plural in
a comment; no reference to the local planning tree, which nobody who clones this repository
has; a file in another public repository is named with its URL; a path in a private
repository is not named at all; a file in this repository is named by its full path; and
every source file opens by saying what it is and what it is for.

Enforced by review: a comment explains a decision, a constraint or a trap, and never
narrates the code beneath it. It stays inside a one to eight line band unless it is
genuinely load-bearing. It holds one flat voice. It is not addressed to any particular
person.

The rule about paths exists because a filename with no path is an instruction to go looking.
The rule about private repositories is the opposite case and was found the hard way: adding
a URL there would give every reader a dead link while publishing the private repository's
name and internal structure.

The checker itself distinguishes comments from strings the visitor sees, which is why it
parses rather than searches. The 404 page addresses its reader in the second person, as
any page telling somebody their link is broken should, and no search for a pronoun can tell
that from a comment.
It also skips fenced code blocks and link destinations in Markdown, because a filename in a
code sample is a literal somebody will copy. Applying the path rule to one of those by hand
corrupted two documented examples before that exclusion existed.

### Three stale numbers, and the rule that came out of them

A comment described a radius as 8px; a later change made it 14px and left the sentence
alone. A helper described a line as 9.5px; it had been 10px since the pass that raised it. A
component described the contribution grid as 370 cells; it holds 365, and after a later fix
that count is a property of what GitHub returns rather than a constant.

None of the three broke anything, and none was findable by searching. A comment naming a
measurement takes on a maintenance cost that nobody can see going unpaid, which is the
argument for keeping comments short and for putting the measurements that explain a decision
in a document like this one instead.

---

## 9. Repository map

```
.github/workflows/    pages.yml publishes the site, ci.yml builds the image,
                      cv.yml checks the CV renders, helm-release.yml packages the chart
cv/                   the CV source, its renderer, and cv/README.md on how the links work
helm/                 the Kubernetes chart that deploys the image
public/               static files copied verbatim into dist/
scripts/              the five generators and the two checkers
src/data/             what the generators write, plus three hand-maintained files
src/lib/  src/hooks/  small pieces with no opinion about appearance
src/components/       the parts a page is assembled from
src/pages/            the five routes
Dockerfile            three stages, ending in nginx with no Node
nginx.conf            headers, caching and the single-page fallback, container only
status.md             the dated record of every structural change
```
