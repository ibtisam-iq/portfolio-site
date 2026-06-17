# Ibtisam IQ — Engineering Portfolio

[![Deploy to Pages](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/pages.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/pages.yml)
[![CI — Build & Push](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/ci.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/ci.yml)
[![Helm — Package & Push](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/helm-release.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/helm-release.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?logo=tailwindcss)](https://tailwindcss.com/)
[![GHCR](https://img.shields.io/badge/GHCR-ibtisam--iq%2Fibtisam--iq-2496ED?logo=github)](https://github.com/ibtisam-iq/portfolio-site/pkgs/container/ibtisam-iq)
[![Docker Hub](https://img.shields.io/badge/Docker_Hub-mibtisam%2Fmibtisam-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/r/mibtisam/mibtisam)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

The source for **[ibtisam-iq.com](https://ibtisam-iq.com)** — the front door to a multi-domain engineering ecosystem covering cloud infrastructure, Kubernetes, CI/CD, and production-grade system design.

This repository contains the **main site**. The deeper surfaces — projects, runbook, knowledge base, certification practice, blog, and more — each live in their own repository, deployed to their own subdomain with their own stack and pipeline (see [Ecosystem](#ecosystem)). The intent is a portfolio that reads like infrastructure: composable, isolated, predictable — not a single monolithic page.

---

## Why this exists

Most portfolios are one page that goes stale the moment it ships. This one is built as a system of small, independently deployable surfaces, so each concern evolves on its own cadence without coupling. The main site stays small and stable; everything that changes frequently lives behind a subdomain.

That separation is the point. It mirrors how production platforms are actually run, and it keeps every surface cheap to reason about, deploy, and roll back.

---

## Ecosystem

This site is the hub. It links out to external surfaces and hosts a handful of internal routes directly.

### External surfaces (subdomains)

| Surface | Purpose | Live | Repo |
| --- | --- | --- | --- |
| **Projects** | Production-style infrastructure and cloud projects | [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com) | [`projects`](https://github.com/ibtisam-iq/projects) |
| **Runbook** | Documented steps from real implementation work | [runbook.ibtisam-iq.com](https://runbook.ibtisam-iq.com) | [`runbook`](https://github.com/ibtisam-iq/runbook) |
| **Knowledge Base** | Personal engineering knowledge base (Nectar) | [nectar.ibtisam-iq.com](https://nectar.ibtisam-iq.com) | [`nectar`](https://github.com/ibtisam-iq/nectar) |
| **Cert Practice Vault** | Execution-first Kubernetes & cloud cert practice | [cert-vault.ibtisam-iq.com](https://cert-vault.ibtisam-iq.com) | [`certification-practice-vault`](https://github.com/ibtisam-iq/certification-practice-vault) |
| **DebugBox** | Multi-variant Docker debugging toolkit | [debugbox.ibtisam-iq.com](https://debugbox.ibtisam-iq.com) | [`debugbox`](https://github.com/ibtisam-iq/debugbox) |
| **Blog** | Distilled write-ups of what was built and learned | [blog.ibtisam-iq.com](https://blog.ibtisam-iq.com) | [`blog`](https://github.com/ibtisam-iq/blog) |
| **Achievements** | Milestones and professional achievements | [achievements.ibtisam-iq.com](https://achievements.ibtisam-iq.com) | [`achievements`](https://github.com/ibtisam-iq/achievements) |
| **Roadmaps** | Engineering learning roadmaps | [roadmaps.ibtisam-iq.com](https://roadmaps.ibtisam-iq.com) | [`roadmaps`](https://github.com/ibtisam-iq/roadmaps) |

Related: [SilverStack](https://github.com/ibtisam-iq/silver-stack) — reusable infrastructure artifacts (scripts, manifests, images) the other surfaces reference.

Each surface is its own repository with its own stack and deploy pipeline — for example, `runbook` is an MkDocs site, independent of this React app — so they evolve and ship without coupling.

### Internal routes (served by this repo)

| Route | Purpose |
| --- | --- |
| `/` | Landing and narrative hub |
| `/certificates` | Verified certifications |
| `/skills` | Technical skill breakdown |
| `/about` | Background and bio |
| `/contact` | Get in touch |

---

## Tech stack

| Layer | Choice | Rationale |
| --- | --- | --- |
| **Language** | TypeScript | Type safety as a first-class constraint, not an afterthought |
| **UI** | React 19 + react-icons | Component model that scales with the content |
| **Build** | Vite 7 | Fast cold starts, native ESM, lean production bundles |
| **Styling** | Tailwind CSS 3 + PostCSS | Utility-first; design decisions stay in the markup |
| **Routing** | React Router 7 | Client-side routing for a static SPA |
| **Quality** | ESLint (flat config) + typescript-eslint | Linting wired into the project, run via `npm run lint` |
| **CI/CD** | GitHub Actions | Pages deploy (with PR previews) + multi-arch container build/push |
| **Container** | Docker (multi-stage) + nginx:alpine | Rootless, hardened image for self-hosting / local parity |
| **Kubernetes** | Helm | Chart packaged and published to GHCR as an OCI artifact |
| **Hosting** | GitHub Pages | Static delivery — no server to run or patch |
| **DNS** | Cloudflare | Domain and subdomain routing |

---

## CI/CD

Three GitHub Actions workflows running on `main`:

**`pages.yml` — GitHub Pages.** Lints, builds, and deploys the static site to Pages on `main`. Pull requests get their own preview deployment (scoped via `VITE_BASE_PATH`), and a `404.html` fallback lets React Router own deep links. Concurrency cancels superseded runs.

**`ci.yml` — Build & Push.** Builds the `Dockerfile` for `linux/amd64` and `linux/arm64` (Buildx + QEMU), pushes by digest to GHCR and Docker Hub, then merges them into one multi-arch manifest. Tagged `latest`, `sha-<short>`, build date, and semver; PRs build without pushing.

**`helm-release.yml` — Helm Package & Push.** Triggered on successful completion of `ci.yml`. Lints the chart with `helm lint`, packages it, and pushes it as an OCI artifact to GHCR. The chart version is extracted dynamically from `Chart.yaml` — no hardcoded values in the pipeline. Only runs when `helm/` has changed; `pages.yml` ignores `helm/**` entirely to avoid redundant deploys.

### Published images

The container pipeline publishes a **multi-arch image** (`linux/amd64`, `linux/arm64`) to two registries:

| Registry | Image |
| --- | --- |
| **GitHub Container Registry** | `ghcr.io/ibtisam-iq/ibtisam-iq` |
| **Docker Hub** | `docker.io/mibtisam/mibtisam` |

Tags include `latest`, `sha-<short>`, the build date, PR refs, and semver. Pull and run either registry:

```bash
# GHCR
docker run --rm -p 8080:8080 ghcr.io/ibtisam-iq/ibtisam-iq:latest

# Docker Hub
docker run --rm -p 8080:8080 mibtisam/mibtisam:latest

# → http://localhost:8080
```

### Install via Helm

The Helm chart is published to GHCR as an OCI artifact alongside the container image:

```bash
helm install portfolio-site oci://ghcr.io/ibtisam-iq/ibtisam-iq --version 0.1.0
```

---

## Architecture at a glance

```
                          ┌──────────────────────┐
                          │      Cloudflare      │
                          │          DNS         │
                          └───────────┬──────────┘
                                      │
        ┌──────────────────┬────────┬─────────────────────┬──────────────────┐
        │                  │                      │                  │
  ibtisam-iq.com    projects.ibtisam-iq    runbook.ibtisam-iq   blog / nectar / …
   (this repo)        (separate repo)        (separate repo)      (separate repos)
        │
   push to main
        │
   ┌────┴─────────────────────────────────────────────────────┐
   │  GitHub Actions                                                │
   │  ├─ pages.yml        → lint → build → deploy to Pages (+ PR preview) │  ← live
   │  ├─ ci.yml           → multi-arch build → push to GHCR + Docker Hub  │  ← images
   │  └─ helm-release.yml → lint → package → push chart to GHCR (OCI)     │  ← chart
   └──────────────────────────────────────────────────────────────────── ┘
```

Production is **static, served from GitHub Pages**, with DNS handled by Cloudflare. No SSR by design — the trade is predictable, fast, and operationally near-zero.

---

## Project structure

```text
portfolio-site/
├── .github/workflows/      # pages.yml · ci.yml · helm-release.yml
├── helm/                   # Helm chart — packaged and published to GHCR as OCI artifact
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
├── public/                 # Static assets (favicon, cv.pdf, etc.)
├── src/
│   ├── components/         # Reusable UI (Navbar, etc.)
│   ├── App.tsx             # Root app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles / Tailwind layer
├── Dockerfile              # Multi-stage build → rootless nginx:alpine
├── nginx.conf              # Hardened nginx config (port 8080, CSP, caching)
├── index.html              # HTML entry — SEO, meta, favicon
├── eslint.config.js
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json           # + tsconfig.app.json, tsconfig.node.json
├── vite.config.ts
└── package.json
```

The layout is intentionally **flat and explicit** — structure that fits in a single mental model.

---

## Local development

**Prerequisites:** Node.js and npm. CI runs on Node 24; the container build pins Node 22 (`22.14-alpine`). Any recent LTS works locally.

```bash
# Install exact, reproducible dependencies from the lockfile
npm ci

# Start the Vite dev server
npm run dev

# Type-check and build for production (tsc -b && vite build)
npm run build

# Lint the codebase
npm run lint

# Preview the production build locally
npm run preview
```

### Run the container

The image is a **3-stage build** (`deps` → `builder` → `production`) that ends on `nginx:alpine` with no Node toolchain in the final layer. It runs **rootless** (`USER nginx`), exposes **8080**, ships a `HEALTHCHECK`, and uses `STOPSIGNAL SIGQUIT` for graceful connection draining.

Pull a published image, or build locally for production parity:

```bash
# Run the published image (GHCR)
docker run --rm -p 8080:8080 ghcr.io/ibtisam-iq/ibtisam-iq:latest
```

```bash
# Build from source (CI injects BUILD_DATE / GIT_SHA as OCI labels)
docker build -t portfolio-site .
docker run --rm -p 8080:8080 portfolio-site

# → http://localhost:8080
```

---

## Local CI Testing (`act`)

Both pipelines can be run locally using [`act`](https://github.com/nektos/act).

```bash
# Run the Pages build pipeline (lint → build → CNAME → 404)
act push \
  -W .github/workflows/pages.yml

# Run the Docker build pipeline (QEMU → Buildx → build)
act push \
  -W .github/workflows/ci.yml
```

> [!NOTE]
> Registry logins, metadata extraction, image pushes, artifact uploads, and GitHub Pages
> deployment are automatically skipped via `if: ${{ !env.ACT }}` guards — `act` sets the
> `ACT` environment variable automatically.
> For `ci.yml`, the build is pinned to `linux/amd64` locally (required for `load: true`)
> and the image is loaded into your local Docker daemon as `mibtisam/mibtisam:local`.

---

## Deployment model

- **Production is static.** Served from GitHub Pages; no application server in the request path.
- **CI builds and deploys.** Pushes to `main` trigger the GitHub Actions workflows — no manual deploys.
- **Three artifacts.** The same source produces the static Pages deploy, a container image published to GHCR and Docker Hub, and a Helm chart published to GHCR as an OCI artifact.
- **PR previews.** Pull requests deploy to isolated preview paths before anything reaches `main`.
- **DNS via Cloudflare.** Domain and subdomain routing are handled at Cloudflare; the custom domain is bound through a `CNAME` in the build.
- **No SSR, by design.** The content doesn't need it; avoiding it removes a class of runtime failure.

---

## Status

**Actively evolving.** New systems, documentation, and projects land incrementally as they reach a production-ready bar. Unfinished sections are intentional staging, not neglect.

---

## License

Released under the [MIT License](./LICENSE).

---

<div align="center">

**Muhammad Ibtisam Iqbal**

DevOps & Infrastructure Engineer · Kubernetes · Cloud · CI/CD

[Website](https://ibtisam-iq.com) · [GitHub](https://github.com/ibtisam-iq)

</div>
