# ibtisam-iq.com

[![Deploy to Pages](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/pages.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/pages.yml)
[![CI: Build & Push](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/ci.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/ci.yml)
[![CV renders](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/cv.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/cv.yml)
[![Helm: Package & Push](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/helm-release.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/helm-release.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?logo=tailwindcss)](https://tailwindcss.com/)
[![GHCR](https://img.shields.io/badge/GHCR-ibtisam--iq%2Fibtisam--iq-2496ED?logo=github)](https://github.com/ibtisam-iq/portfolio-site/pkgs/container/ibtisam-iq)
[![Docker Hub](https://img.shields.io/badge/Docker_Hub-mibtisam%2Fmibtisam-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/r/mibtisam/mibtisam)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Source for **[ibtisam-iq.com](https://ibtisam-iq.com)**, the portfolio of Muhammad Ibtisam
Iqbal. One codebase, published two ways: a static site on GitHub Pages, and a rootless
nginx image for self-hosting, with a Helm chart to install it.

**Every number on the site is derived, not typed.** Docker pulls, GitHub contributions,
project counts, the tools grid, container image sizes: each is read from a source anyone can
inspect, written into a file at build time, and shown alongside a note saying where it came
from and when it was measured. Most of what is unusual about this repository follows from
that one decision.

For how any of it works and why it was built this way, see **[REFERENCE.md](./REFERENCE.md)**.

---

## The site

| Route | What is on it |
| --- | --- |
| `/` | The claim, four measured figures, featured projects, the ecosystem, an interactive terminal |
| `/tools` | 71 tools in 6 domains, each cross-referenced to the projects using it |
| `/certificates` | CKA and CKAD earned, CKS and AWS SAA in preparation, with credential IDs |
| `/about` | How the work started, the pipeline it turned into, and a year of activity |
| `/contact` | Availability, terms, and a subject picker that pre-writes the message |
| `/cv.pdf` | The CV, rendered from HTML at build time |

The terminal on the homepage is real. It takes input and answers from the site's own
generated data.

## The ecosystem

The site links to five places the work lives, each independently deployed from its own
repository.

| Surface | Purpose | Live | Repository |
| --- | --- | --- | --- |
| **Projects** | Infrastructure and cloud projects, and the source of this site's project data | [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com) | [projects](https://github.com/ibtisam-iq/projects) |
| **Runbook** | Documented steps from real implementation work | [runbook.ibtisam-iq.com](https://runbook.ibtisam-iq.com) | [runbook](https://github.com/ibtisam-iq/runbook) |
| **Blog** | Write-ups of what was built and debugged | [blog.ibtisam-iq.com](https://blog.ibtisam-iq.com) | |
| **Nectar** | Engineering knowledge base | [nectar.ibtisam-iq.com](https://nectar.ibtisam-iq.com) | [nectar](https://github.com/ibtisam-iq/nectar) |
| **SilverStack** | Reusable infrastructure: provisioning scripts, OCI rootfs images, systemd units | | [silver-stack](https://github.com/ibtisam-iq/silver-stack) |

Alongside them: [Cert Vault](https://cert-vault.ibtisam-iq.com) for certification practice,
[SideQuest](https://sidequest.ibtisam-iq.com), and
[DebugBox](https://github.com/ibtisam-iq/debugbox), a multi-variant container debugging
image whose size table on the homepage is read from its own README at build time.

---

## Running it

```bash
npm ci
npm run dev              # generate, then the dev server
npm run build            # generate, compile, prerender per-route metadata into dist/
npm run preview          # serve the production build
```

`npm run generate` runs automatically before `dev` and `build`. It reaches the network to
read the upstream repositories and the Docker Hub and GitHub APIs. A clone with no network
still builds, because every generated file is committed alongside the code.

### Checks

```bash
npm run lint             # ESLint
npm run check:prose      # the writing rules for every comment and document here
npm run check:contrast   # colour contrast, in a real browser, against dist/
```

`check:contrast` measures every text node against its composited background, plus the
generated tool marks and overflow at 375px. It reads `dist/`, so build first. `check:prose`
enforces the rules the comments here follow. Both run in CI on every push.

### The CV

```bash
npm run cv
```

Renders `cv/cv.html` to PDF. The public form carries no phone number. Private per-recruiter
variants are generated behind unguessable URLs and are excluded from git, from the container
image and from every build that does not hold the secret. See
[cv/README.md](./cv/README.md).

### Container

Three stages, ending in `nginx:alpine` with no Node toolchain. Runs rootless, listens on
8080, carries a healthcheck.

```bash
docker run --rm -p 8080:8080 ghcr.io/ibtisam-iq/ibtisam-iq:latest
```

```bash
npm run generate         # the image build does not generate; it compiles what is here
docker build -t portfolio-site .
docker run --rm -p 8080:8080 portfolio-site
```

Published to `ghcr.io/ibtisam-iq/ibtisam-iq` and `docker.io/mibtisam/mibtisam`, for
`linux/amd64` and `linux/arm64`.

### Running the pipelines locally

Both publishing workflows run under [act](https://github.com/nektos/act).

```bash
act push -W .github/workflows/pages.yml   # everything but the three steps that publish
act push -W .github/workflows/ci.yml      # single-arch, loaded locally instead of pushed
docker run --rm -p 8080:8080 mibtisam/mibtisam:local
```

The image build adapts rather than opts out, so a local run ends with an image that starts.
The CV check needs no guards and runs as it is; the chart workflow is a registry push
throughout and has little left to run.

### Helm

```bash
helm install portfolio-site oci://ghcr.io/ibtisam-iq/ibtisam-iq --version 0.1.0
```

The chart is in [helm/](./helm), with its own [README](./helm/README.md).

---

## Stack

| Layer | Choice |
| --- | --- |
| Language | TypeScript 5.9 |
| UI | React 19, react-icons |
| Build | Vite 8 |
| Styling | Tailwind CSS 3, PostCSS |
| Routing | React Router 7 |
| Quality | ESLint 10 flat config, typescript-eslint, two project-specific checkers |
| Runtime for the build | Node 24 |
| CI/CD | GitHub Actions, four workflows |
| Container | Multi-stage Docker, nginx:alpine, rootless |
| Packaging | Helm chart, published to GHCR as an OCI artifact |
| Hosting | GitHub Pages |
| DNS | Cloudflare |

---

## Pipelines

Four workflows, each scoped to the paths it needs.

| Workflow | Trigger | What it does |
| --- | --- | --- |
| [.github/workflows/pages.yml](./.github/workflows/pages.yml) | push to `main`, a daily schedule, or manually | Lint, prose check, generate, build, verify every route's metadata, contrast check, deploy to GitHub Pages. Pull requests get an isolated preview. |
| [.github/workflows/ci.yml](./.github/workflows/ci.yml) | push to `main` | Generate on the runner, then a multi-architecture image build pushed to GHCR and Docker Hub. Pull requests build without pushing. |
| [.github/workflows/cv.yml](./.github/workflows/cv.yml) | pull requests touching `cv/**` | Renders the public CV and fails if it is blank, if it lost a required line, or if a phone number reached it. Commits nothing. |
| [.github/workflows/helm-release.yml](./.github/workflows/helm-release.yml) | push to `main` touching `helm/**` | Lint, package, and push the chart to GHCR as an OCI artifact. |

The schedule exists because two of the site's four data sources change with no commit at
all. Without it the published numbers would only refresh when this repository happens to be
pushed.

Nothing is committed by a workflow. No PDF and no generated artifact is written back to the
repository, so a deploy always reflects the source rather than whatever was last committed
by a robot.

### Per-route metadata

The site is client-rendered, so a crawler that does not execute JavaScript would otherwise
resolve every deep link back to the root.
[scripts/prerender-meta.js](./scripts/prerender-meta.js) writes a shell per route with its
own metadata, plus `404.html`, a sitemap, `robots.txt`, `llms.txt` and `profile.json`, all
derived from [scripts/profile.js](./scripts/profile.js) and none of it committed.

---

## Layout

```text
portfolio-site/
├── .github/workflows/   pages.yml, ci.yml, cv.yml, helm-release.yml
├── cv/                  the CV source, its renderer, and how the private links work
├── helm/                the Kubernetes chart
├── public/              static files, copied verbatim into dist/
├── scripts/
│   ├── generate-from-projects.js    the projects repository  → src/data/generated.ts
│   ├── generate-debugbox.js         the DebugBox README      → src/data/debugbox.ts
│   ├── generate-stats.js            Docker Hub and GitHub    → src/data/stats.ts
│   ├── generate-contributions.js    the contribution year    → src/data/contributions.ts
│   ├── profile.js                   identity, credentials and sites, edited only here
│   ├── prerender-meta.js            per-route shells, sitemap, robots, llms, profile
│   ├── check-contrast.mjs           contrast, in a real browser
│   └── check-prose.mjs              the writing rules
├── src/
│   ├── components/      the parts a page is assembled from
│   ├── pages/           the five routes
│   ├── data/            what the generators write, plus three hand-maintained files
│   ├── lib/  hooks/     small pieces with no opinion about appearance
│   ├── context/         the theme
│   ├── App.tsx          the router, and the only definition of what pages exist
│   └── index.css        the Tailwind @theme palette, surfaces, containers, label roles
├── Dockerfile           three stages, ending in nginx with no Node
├── nginx.conf           headers, caching and the SPA fallback, container only
└── REFERENCE.md         what everything is, and why it was built this way
```

---

## License

[MIT](./LICENSE)

---

<div align="center">

**Muhammad Ibtisam Iqbal**

DevOps and Cloud Engineer · Kubernetes · AWS · CI/CD

[Website](https://ibtisam-iq.com) · [GitHub](https://github.com/ibtisam-iq)

</div>
