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
and published two ways from the same output: as a static site on Cloudflare Pages, and as an
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

Those committed copies lag what the sources return, and the local copies lag further, until
someone builds and commits. That is harmless: the runner regenerates them before every
deploy and the daily schedule redeploys with no push, so the live site is current whatever
is in git. They exist for the offline build and the reviewable diff, not to feed the deploy.

Three data files are maintained by hand, because nothing measures what they hold:
`src/data/availability.ts`, `src/data/certificates.ts` and `src/data/terminal.ts`.

### One line is read live, not at build time

The "shipped" status in the hero and the footer names the most recently pushed public
repository and how long ago, and the "how long ago" keeps counting while the page is open.
Every other number is measured once and shown with the date it was measured, which stays
honest however old it gets. An age does not: a build from three days ago has this line say
a push happened three days ago, whatever the repositories have done since.

So this one value is read from the GitHub API when the page loads, by
`src/hooks/useLatestPush.ts`. That API allows a page to read it directly, which Docker Hub
and the contribution fragment do not, so it needs no proxy and no token.
`scripts/generate-stats.js` still writes the value into `src/data/stats.ts`, and that copy
is what shows until the read returns and what stays if the reader is offline or GitHub
refuses the request. The hero and the footer share the one hook, so they cannot disagree.

The terminal's `stats` command used to print this too, from the build-time file. It was
dropped rather than wired to the hook: that command lists counts, a push date is not one,
and a second reading of the same fact is a second thing that can be wrong.

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

One file holds it: `src/index.css`. Its `@theme` block names the colours and the type
(Tailwind v4 reads the config from CSS, not a `tailwind.config.js`), and the rest of the
file defines the surfaces, the containers and the label roles that every page composes from.

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

A second blind spot outlasted that one. The script read the declared colour and ignored
what `opacity` and an alpha channel do to it, so a DebugBox size label at 70% opacity and
the active tool count declared as `text-teal-accent/70` both passed while sitting at 3.3:1
on the light theme. Both are at full strength now. The mono face at that size already
separates a figure from its label, so the fade was buying nothing that the type did not
already do.

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

`npm run build` runs four things in order. It compiles the TypeScript. Vite bundles the
site into `dist/`. Vite runs a second time over `src/entry-server.tsx` to produce
`dist-ssr/entry-server.js`, a copy of the application that runs under Node. Then
`scripts/prerender-meta.js` uses that copy to render every route, and writes a separate
HTML shell for each one with its own markup, title, description and canonical URL, plus
`404.html`, `sitemap.xml`, `robots.txt`, `llms.txt` and `profile.json`.

`dist-ssr/` is a build artifact and is in `.gitignore`. It is never published: it exists
for the length of one build, so the rendering can happen without a browser.

`scripts/profile.js` is the single place identity, credentials and sites are edited.
Everything in the list above is derived from it, and none of those outputs is committed.

### The fonts ship with the build

Inter and JetBrains Mono are served from this origin, not from Google. One variable file
per family covers every weight the site uses, the `@font-face` rules live in
`src/index.css`, and Vite fingerprints both files into `dist/assets/`, where they inherit
the year of `immutable` caching described further down.

Only the latin ranges are declared, which is why the build emits two font files rather than
twelve. The packages carry cyrillic, greek and vietnamese as well, nothing on this site is
written in them, and every range declared is another file to emit and cache.

What the move bought, measured locally against a simulated phone. The Google version needed
a stylesheet from `fonts.googleapis.com` and then a font file from `fonts.gstatic.com`, two
handshakes in sequence before any text could be painted in its real face, and the font
landed at 700ms. From this origin the connection is already open and the font lands at
80ms. First paint went from 4.4s to 3.6s on the phone profile, and from 0.9s to 0.7s on the
desktop one.

It also narrows the policy. `font-src` is `'self'` alone and `style-src` names no host at
all, so a Google host reappearing in `nginx.conf` means the fonts have quietly moved back.

`scripts/prerender-meta.js` preloads the sans, reading its fingerprinted name out of the
build rather than restating it. That became necessary with pre-rendering: text now paints
before the stylesheet naming the font has been reached, so the face arrived late and moved
the header when it landed. Preloading the mono as well was measured and rejected, since it
cost 0.4s of first paint on a throttled phone to fix a shift it was not causing.

### Pre-rendering, and the four things that stood in its way

Every route's HTML is written into its shell at build time, so the page arrives readable
and the browser's only job is to take over the markup that is already there. With
JavaScript switched off the landing page shows 601 words and its heading; before this it
showed none.

`src/entry-server.tsx` renders a route, `src/main.tsx` calls `hydrateRoot` on what it
finds, and the two wrap the application in the same tree down to `StrictMode`, because a
structural difference between them is a mismatch waiting to happen.

Hydration is an agreement about markup. React renders the page a second time in the
browser and compares; where the two disagree it throws away everything the build produced
and starts again. Four things here disagreed, and each was fixed rather than worked
around.

**The hero's entrance** was an opacity fade gated on a mounted flag, so the server would
have written the first screen into the HTML at zero opacity. It is a slide now, with no
fade, driven by `.hero-rise` in `src/index.css` and a per element delay. The markup is
identical before and after hydration and the text is readable from the first frame.

**The counting figures** would have shipped as `0`. They show their measured values.

**The live shipped strip** depends on a clock, which the build does not have. The row is
always rendered and only the age inside it waits, so the heading below does not move when
the browser takes over.

**The theme button** chose its icon from React state, and the build has no theme to read.
Both icons ship now and the `dark` class on the root element decides between them, each
with its own label, so the icon is right before any JavaScript runs and correct for a
screen reader.

One thing is marked rather than fixed. The footer's year comes from the clock, so a build
in December and a visit in January disagree. It carries `suppressHydrationWarning`, which
is React's escape hatch for exactly that, because otherwise one turn of the year would
make React rebuild the entire page.

### Measuring this, and the trap in measuring it

Lighthouse has two throttling methods and they disagree completely about pre-rendering.

The default, `simulate`, loads the page at full speed and models a slow connection
afterwards. Against a local server everything arrives in milliseconds, so the model treats
the JavaScript bundle as part of the path to first paint whether the page needed it or
not. Measured that way, pre-rendering scored **78 against 80**, which is to say it looked
like a regression.

`--throttling-method=devtools` throttles the connection for real and measures what
happens. Same two builds, same machine, same minute:

| | Before | After |
|---|---|---|
| Phone score | 72 | **94** |
| Phone first paint | 3.7s | **2.3s** |
| Phone largest paint | 5.1s | **2.3s** |
| Desktop largest paint | 0.7s | **0.1s** |

Applied throttling is the method to use for anything that changes what has to arrive
before a page can paint. The simulated one is fine for comparing two builds that load the
same things in the same order, which is what every earlier measurement here was doing.

### Analytics waits for the page

The Google tag is 176KB of script that measures the page rather than building it. It used
to be requested from the document head, where it competed with the bundle for the same
connection and the same main thread.

`public/analytics.js` appends the tag on the window `load` event instead. The `gtag` calls
run immediately and queue on `dataLayer`, and the tag replays that queue when it arrives,
so nothing is lost by asking late.

The cost is worth stating rather than hiding: a visitor who leaves within the first second
or two is no longer counted. That trade was taken deliberately, because the alternative is
making every visitor wait for a script whose only job is to watch them.

### The hero's figures, and why they stopped counting

The three figures in the hero used to count up from zero over as much as 2200ms. The Docker
pulls figure is the largest piece of text painted on the first screen, so Chrome treated
the frame it stopped moving on as the moment the page finished, and reported a 2.0s largest
contentful paint on a desktop connection. That single animation held the desktop score at
90 while every other measurement on the same run had improved.

Shortening them to about a second put the score back. Pre-rendering then removed them
entirely, because a page whose HTML is written at build time would have shipped `0` in it,
and the real figure is the entire point of the band.

The rule that came out of the first half of that: an animation over the largest element on
the first screen is not decoration, it is the page's loading time as every measuring tool
will report it.

### One address per page, with the trailing slash

Every route is published as a directory, so `/tools/index.html` is what a static host
serves, and `/tools` is answered with a 301 to it. GitHub Pages, Cloudflare Pages and the
container's nginx all behave that way.

For months the sitemap, the canonical tag and `og:url` all named the redirecting form while
`src/hooks/useCanonical.ts` rewrote the same tag to the slashed form once the app had
booted, so a crawler was handed two different canonicals for one page. Google's index shows
what that cost: `/about`, `/certificates` and `/contact` were eventually crawled through the
redirect, and `/tools` was not. On 26 September 2026 it sat in Search Console's "Discovered,
currently not indexed" list as `https://ibtisam-iq.com/tools`, the only address from this
site in that list, alongside a "Page with redirect" report naming the sitemap.

The rule that came out of it: **the address a page advertises is the one the host answers
with 200, and it is spelled the same way everywhere.** That covers the sitemap, the
canonical, `og:url`, the in-browser canonical and every internal link, so nothing the site
publishes about itself points at a redirect.

Two checks read those addresses and both allow for the slash rather than restating it.
`.github/workflows/pages.yml` asserts each shell's `og:url` ends in one.
`scripts/check-contrast.mjs` compares the sitemap against the router, which declares routes
without a slash, so it trims before comparing: the comparison is about which pages exist,
not how they are spelled. `src/components/Navbar.tsx` trims for the same reason, so a
visitor arriving on a bare path from an older link still sees the right tab highlighted.

### The two deployments

`.github/workflows/pages.yml` builds the site and publishes it. **Cloudflare Pages serves
`ibtisam-iq.com`.** The same build is also published to GitHub Pages, which served the domain
until 27 September 2026 and is now kept only as the rollback.

`.github/workflows/ci.yml` builds and pushes a container image for two architectures. The
`Dockerfile` has three stages and the final one is nginx with no Node in it.

### When a deploy happens, and when it does not

| Trigger | What happens |
| --- | --- |
| `push` to `main` | Gates, build, publish. Markdown, `helm/` and `.github/` are among the `paths-ignore` entries, so editing only those publishes nothing |
| `pull_request` | Gates and build only. **Nothing is deployed**, which is also why a fork or a Dependabot branch never needs a deployment secret |
| `workflow_dispatch` | A deploy asked for by hand, from the Actions tab |
| `schedule`, 03:17 UTC daily | The deploy nothing else can replace. Four of the site's figures are read from GitHub and Docker Hub at build time, so without it they freeze at whatever the last build measured |

The publishing step is the upload to Cloudflare. It needs no Pages environment, no artifact
handover and no deployment slot, which removed the part of the old arrangement that could
fail after a green build.

`.github/workflows/ci.yml` is manual only, and that is a separate decision: a
multi-architecture image build on every push or pull request cost minutes and published
nothing that was wanted.

### Why Cloudflare does not build the site

The Pages project is **Direct Upload**: the workflow hands it a finished `dist/` and
Cloudflare runs no build of its own. A Pages project is either connected to Git or accepting
uploads, not both, so the Git connection was removed on 27 September 2026.

Letting Cloudflare build was tried and is not viable, which is worth recording because the
project's own history suggests otherwise: its last green build, on 26 August 2026, ran
`tsc -b && vite build && node scripts/prerender-meta.js` and nothing else, because the
`prebuild` hook did not exist yet. Today `npm run build` also runs `npm run generate`, which
reads the GitHub and Docker Hub APIs and renders the CV through Puppeteer. The runner installs
`fonts-liberation` first or the CV's pagination moves, and a build environment that cannot
install a system font cannot reproduce that. One build definition, on the runner that already
satisfies it, is the whole reason for this shape.

### The rollback, and the one thing still resting on GitHub Pages

The apex is a proxied CNAME to the Pages project. **Rollback is that single record**: point
`ibtisam-iq.com` back at `ibtisam-iq.github.io` as DNS only. GitHub Pages still receives every
build, so the fallback is current rather than whatever was last deployed before the move.

`www.ibtisam-iq.com` is still a CNAME to `ibtisam-iq.github.io`, and the 301 to the apex it
answers with is served by GitHub Pages, not by Cloudflare. It works because GitHub Pages is
deliberately still deployed. Turning GitHub Pages off therefore breaks `www` and nothing
else, and the replacement is a Cloudflare redirect rule, not a second custom domain: two
hostnames serving the same pages is a duplicate, which is the problem the canonical rule in
section 6 exists to avoid.

### The two Cloudflare secrets

`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are GitHub repository secrets, read in one
place: the `Deploy to Cloudflare Pages` step of `.github/workflows/pages.yml`. They authorise
that upload and nothing else. Neither appears in the site, the container, the image or the
browser, and neither is in this repository. The token needs one permission, Cloudflare Pages:
Edit.

The `CV_PHONE` and `CV_SECRET` values also set in the Cloudflare project are now inert: they
were build variables, and Cloudflare no longer builds. The pair that matters are the GitHub
secrets of the same name, which the runner uses.

### Response headers, generated from the container's policy

`dist/_headers` is how a static host is told what to send. Cloudflare Pages reads it; GitHub
Pages ignores it, which is why the live site carried no security headers and a fixed
ten-minute cache for as long as it was served there.

`scripts/prerender-meta.js` writes that file, and **parses the policy out of
`nginx-security-headers.conf` rather than restating it**. Two copies of a content security
policy drift, and the drift is silent until something a page needs is blocked in one
deployment and not the other. The parser fails the build if it finds fewer than six
headers, because a policy that quietly disappears is worse than a build that stops.

It appends rather than overwrites: `cv/build-pdf.mjs` has already written the private CV
tree's `noindex` block into that file whenever a CV secret was present, and that rule has to
survive. `/assets/*` gets a year of `immutable` caching, safe because Vite content-hashes
every filename there; nothing else does, since `index.html` names those hashed URLs and a
stale copy points at files that no longer exist.

The image builds with data generation disabled, and that is deliberate. The CV renderer
needs a browser that does not run on the Alpine base at all; the data scripts need network
access and a token, and would produce different output on every rebuild of the same commit.
So generation happens once, outside, and the build stage compiles what it produced. The CI
workflow does that on the runner before calling `docker build`, and refuses to continue if
the CV is missing.

`nginx-security-headers.conf` is where the policy is written, and it is the source for
both deployments: the container includes it, and the static host gets it through the
generated `dist/_headers` described above. A rule added there changes both.
The policy permits exactly what the page uses: the analytics tag's host in
`script-src`, and its beacon and the GitHub API in `connect-src`. `font-src` is `'self'`
and `style-src` names no host, both narrowed on 27 September 2026 when the two families
moved to this origin. It permits no inline script, and `index.html` contains none, because
the two scripts that were inline are now `public/theme.js` and `public/analytics.js`.

That is deliberate and is the reason those files exist. The alternative to a self-hosted
file is a hash of the inline text in the policy, and a hash breaks on any whitespace edit,
silently, in one deployment out of two. Widening `script-src` to `'unsafe-inline'` is not an
option at all, since it defeats the policy it would be written into.

### The container declared a policy it was not sending

nginx does not inherit `add_header` into a `location` that adds a header of its own. Both
locations in `nginx.conf` set caching, so both dropped the entire inherited set. Read top
to bottom the file looked hardened; what it actually served was this:

| | Before | After |
|---|---|---|
| Security headers on every HTML page | **0 of 7** | 7 of 7 |
| Security headers on assets | 1 of 7 | 7 of 7 |

The pages are the only place a content security policy does anything, and they were the
ones getting none of it. The headers now live in `nginx-security-headers.conf` and every
location includes it. `scripts/prerender-meta.js` fails the build if any location does
not, because the mistake is invisible in the file and this is the one thing that reads it
on every build.

Three more things were wrong in the same file, all found by running the image rather than
reading it.

**The one-year cache matched on file extension**, so `public/theme.js`,
`public/analytics.js` and every favicon were served `immutable` for a year despite
carrying no hash in their names. A change to any of them would have reached nobody.
Caching is scoped to `/assets/` now, which is the only directory Vite fingerprints, and
the unhashed files get the four hours Cloudflare Pages gives them.

**That scoping did not work at first.** nginx tries regex locations before a plain prefix
match, so the extension block kept winning `/assets/` and the hashed files were being
served with the four-hour rule. `location ^~ /assets/` is what stops it, and only running
the container showed the difference.

**Unknown paths answered 200 with the home page.** The old fallback sent everything to
`index.html`, which was a soft 404 already and got worse once the build started rendering
routes: a dead address served the landing page's own content. It is `try_files ... =404`
with `error_page 404 /404.html` now, which is what Cloudflare Pages does.

**Redirects leaked the container's port.** nginx builds an absolute redirect from its own
listen port, so `/tools` answered with a `Location` on port 8080: right inside the
container, wrong through anything publishing it elsewhere. `absolute_redirect off` sends
a path instead.

One gap is worth stating plainly. `.github/workflows/ci.yml` only runs when it is started
by hand, so nothing builds this image automatically. When `scripts/prerender-meta.js`
began reading the policy file on 27 September 2026, the builder stage was not copying it
and **the image stopped building entirely for a day** with nobody to notice. The Dockerfile
copies it now, and the error names the cause, but the image is still only as verified as
the last time somebody ran that workflow.

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

Four scripts, all runnable locally and all run by CI.

`npm run lint` is ESLint.

`npm run check:contrast` serves the built site to a real headless browser, walks every text
node on every route in both themes, and measures the contrast of each against its composited
background. It also checks the generated tool marks and looks for horizontal overflow at
375px.

Five things about it were wrong in earlier versions and are worth stating.

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

It composites the foreground, and it waits for the page to stop animating before measuring
anything. Reading `color` on its own flattered every faded value on the site: a size label
at 70% opacity reported 6.1:1 and was actually 3.3:1, and an accent declared with a `/70`
alpha reported the same way. Both were live and both were below AA.

Waiting turned out to matter as much as compositing. At `networkidle0` the reveals are
still fading, so a node caught mid-transition reports a ratio no visitor is ever shown. The
run now waits past the 1200ms reveal fallback in `src/hooks/useInView.ts` and drains every
finite animation first, which also raised coverage: the landing page went from 126 text
nodes measured to 174.

`npm run check:hydration` loads every route in both themes and fails if the rendered
markup did not survive. It exists because pre-rendering breaks without looking broken:
React finds markup it did not expect, discards it, rebuilds the page in the browser, and
the visitor sees the right thing a moment later. Nothing on screen says the build's work
was thrown away.

It watches for that directly. A `MutationObserver` installed before anything on the page
runs records whether the mount point ever had children removed, which is the difference
between React adopting the markup and React starting again. It also reads the shells off
disk first and fails if two routes rendered the same heading, which is what a broken route
list looks like.

Its limit is worth stating. A production build recovers from a text or structure
difference by discarding the tree, and that is what this catches. A differing attribute is
patched in place and passes here. Both negative cases were run against it before it was
trusted: bypassing hydration entirely, and a genuine text mismatch. It failed on both.

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
scripts/              the five generators, the renderer and the three checkers
src/data/             what the generators write, plus three hand-maintained files
src/lib/  src/hooks/  small pieces with no opinion about appearance
src/components/       the parts a page is assembled from
src/pages/            the five routes
Dockerfile            three stages, ending in nginx with no Node
nginx.conf            caching, redirects and real 404s, container only
nginx-security-headers.conf   the policy, included by nginx and read by the build
status.md             the dated record of every structural change
```
