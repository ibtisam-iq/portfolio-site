# Ibtisam IQ Portfolio

[![Deploy to Pages](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/pages.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/pages.yml)
[![Build CV PDF](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/cv.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/cv.yml)
[![CI: Build & Push](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/ci.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/ci.yml)
[![Helm: Package & Push](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/helm-release.yml/badge.svg)](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/helm-release.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?logo=tailwindcss)](https://tailwindcss.com/)
[![GHCR](https://img.shields.io/badge/GHCR-ibtisam--iq%2Fibtisam--iq-2496ED?logo=github)](https://github.com/ibtisam-iq/portfolio-site/pkgs/container/ibtisam-iq)
[![Docker Hub](https://img.shields.io/badge/Docker_Hub-mibtisam%2Fmibtisam-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/r/mibtisam/mibtisam)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Source code for **[ibtisam-iq.com](https://ibtisam-iq.com)**. Static site deployed to GitHub Pages, containerized for self-hosting, and packaged as a Helm chart. Four GitHub Actions workflows produce four artifacts from one push.

---

## Ecosystem

The main site links out to independently deployed surfaces, each in its own repository with its own stack and pipeline.

### External surfaces

| Surface | Purpose | Live | Repo |
| --- | --- | --- | --- |
| **Projects** | Infrastructure and cloud projects | [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com) | [`projects`](https://github.com/ibtisam-iq/projects) |
| **Runbook** | Documented steps from real implementation work | [runbook.ibtisam-iq.com](https://runbook.ibtisam-iq.com) | [`runbook`](https://github.com/ibtisam-iq/runbook) |
| **Nectar** | Engineering knowledge base (200+ pages) | [nectar.ibtisam-iq.com](https://nectar.ibtisam-iq.com) | [`nectar`](https://github.com/ibtisam-iq/nectar) |
| **Cert Vault** | Kubernetes and cloud certification prep | [cert-vault.ibtisam-iq.com](https://cert-vault.ibtisam-iq.com) | [`certification-practice-vault`](https://github.com/ibtisam-iq/certification-practice-vault) |
| **DebugBox** | Multi-variant Docker debugging toolkit | [debugbox.ibtisam-iq.com](https://debugbox.ibtisam-iq.com) | [`debugbox`](https://github.com/ibtisam-iq/debugbox) |
| **Blog** | Write-ups of what was built and debugged | [blog.ibtisam-iq.com](https://blog.ibtisam-iq.com) | [`blog`](https://github.com/ibtisam-iq/blog) |
| **Achievements** | Professional milestones | [achievements.ibtisam-iq.com](https://achievements.ibtisam-iq.com) | [`achievements`](https://github.com/ibtisam-iq/achievements) |
| **Roadmaps** | Engineering roadmaps | [roadmaps.ibtisam-iq.com](https://roadmaps.ibtisam-iq.com) | [`roadmaps`](https://github.com/ibtisam-iq/roadmaps) |

Related: [SilverStack](https://github.com/ibtisam-iq/silver-stack) (reusable infrastructure: provisioning scripts, OCI rootfs images, systemd units).

### Internal routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page with featured projects and methodology |
| `/skills` | 66 tools across 9 categories with project cross-references |
| `/certificates` | CKA, CKAD earned; CKS and AWS SAA in progress |
| `/about` | Background and bio |
| `/contact` | Contact and availability |
| `/cv.pdf` | Auto-generated resume (HTML to PDF via Puppeteer) |

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| **Language** | TypeScript 5.9 |
| **UI** | React 19, react-icons |
| **Build** | Vite 7 |
| **Styling** | Tailwind CSS 3, PostCSS |
| **Routing** | React Router 7 |
| **Quality** | ESLint (flat config), typescript-eslint |
| **CI/CD** | GitHub Actions (4 workflows) |
| **Container** | Docker multi-stage, nginx:alpine, rootless |
| **Packaging** | Helm chart published to GHCR as OCI artifact |
| **Hosting** | GitHub Pages |
| **DNS** | Cloudflare |

---

## CI/CD

Four workflows, each scoped to the paths it cares about. No workflow triggers another unless it has to.

| Workflow | Trigger | What it does |
| --- | --- | --- |
| **`pages.yml`** | Push to `main` (site source) | Lint, build, deploy to GitHub Pages. PRs get isolated preview deploys. |
| **`cv.yml`** | Push to `main` (`cv/**`) | Renders `cv/cv.html` to PDF via Puppeteer, commits `public/cv.pdf`. That commit triggers `pages.yml` and `ci.yml` to pick up the new file. |
| **`ci.yml`** | Push to `main` (site source) | Multi-arch Docker build (`amd64` + `arm64`), push to GHCR and Docker Hub. PRs build without pushing. |
| **`helm-release.yml`** | Push to `main` (`helm/**`) | Lint, package, and push the Helm chart to GHCR as an OCI artifact. |

### Trigger isolation

Each workflow ignores paths it does not need. A single commit that touches multiple areas triggers only the relevant workflows, with no redundant runs.

| Changed paths | pages | cv | ci | helm |
| --- | --- | --- | --- | --- |
| `src/`, `public/`, configs | runs | - | runs | - |
| `cv/**` | - | runs (commits PDF, that push triggers pages + ci) | - | - |
| `helm/**` | - | - | - | runs |
| `.github/**`, `*.md` | - | - | - | - |

### Published images

Multi-arch (`linux/amd64`, `linux/arm64`) pushed to two registries:

| Registry | Image |
| --- | --- |
| **GHCR** | `ghcr.io/ibtisam-iq/ibtisam-iq` |
| **Docker Hub** | `docker.io/mibtisam/mibtisam` |

```bash
docker run --rm -p 8080:8080 ghcr.io/ibtisam-iq/ibtisam-iq:latest
# → http://localhost:8080
```

### Helm chart

```bash
helm install portfolio-site oci://ghcr.io/ibtisam-iq/ibtisam-iq --version 0.1.0
```

### CV pipeline

The resume is a single HTML file (`cv/cv.html`) with inline CSS for print layout. Puppeteer renders it to an A4 PDF with zero margins.

```
cv/cv.html  →  Puppeteer (build-pdf.mjs)  →  public/cv.pdf  →  ibtisam-iq.com/cv.pdf
```

Build locally:

```bash
node cv/build-pdf.mjs
```

---

## Architecture

```
                          ┌──────────────────────┐
                          │   Cloudflare DNS     │
                          └───────────┬──────────┘
                                      │
        ┌──────────────────┬──────────┼──────────────────┬──────────────────┐
        │                  │          │                  │                  │
  ibtisam-iq.com    projects.*    runbook.*         blog.*           nectar.*
   (this repo)      (separate)    (separate)       (separate)       (separate)
        │
   push to main
        │
   ┌────┴─────────────────────────────────────────────────────┐
   │  GitHub Actions                                          │
   │  ├─ pages.yml        → build, deploy to Pages            │
   │  ├─ cv.yml           → HTML → PDF, commit                │
   │  ├─ ci.yml           → multi-arch image → GHCR + Hub     │
   │  └─ helm-release.yml → chart → GHCR OCI                  │
   └──────────────────────────────────────────────────────────┘
```

Static site on GitHub Pages. No SSR. No application server in the request path.

---

## Project Structure

```text
portfolio-site/
├── .github/workflows/      # pages.yml, cv.yml, ci.yml, helm-release.yml
├── cv/                     # Resume source (cv.html + build-pdf.mjs → public/cv.pdf)
├── helm/                   # Helm chart (published to GHCR as OCI artifact)
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
├── public/                 # Static assets (favicons, cv.pdf, webmanifest)
├── src/
│   ├── components/         # Hero, Navbar, Footer, FeaturedProjects, Methodology, Reveal
│   ├── context/            # ThemeContext (dark/light mode)
│   ├── data/               # certificates.ts, toolProjects.ts
│   ├── hooks/              # useCountUp, useDocumentTitle, useInView, useTypewriter
│   ├── pages/              # Skills, Certificates, ContactPage, HowItStarted, NotFound
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── Dockerfile              # Multi-stage → rootless nginx:alpine
├── nginx.conf              # Hardened config (port 8080, CSP headers, caching)
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## Development

```bash
npm ci              # Install from lockfile
npm run dev         # Vite dev server
npm run build       # Type-check + production build
npm run lint        # ESLint
npm run preview     # Preview production build
```

### Container

3-stage build (`deps` → `builder` → `production`). Final layer is `nginx:alpine` with no Node toolchain. Runs rootless (`USER nginx`), exposes port 8080, includes a `HEALTHCHECK`.

```bash
# Published image
docker run --rm -p 8080:8080 ghcr.io/ibtisam-iq/ibtisam-iq:latest

# Build from source
docker build -t portfolio-site .
docker run --rm -p 8080:8080 portfolio-site
```

### Local CI with `act`

```bash
act push -W .github/workflows/pages.yml    # Pages pipeline
act push -W .github/workflows/ci.yml       # Docker pipeline
```

Registry pushes, artifact uploads, and deployments are skipped locally via `!env.ACT` guards.

---

## License

[MIT](./LICENSE)

---

<div align="center">

**Muhammad Ibtisam Iqbal**

DevOps & Cloud Engineer · Kubernetes · AWS · CI/CD

[Website](https://ibtisam-iq.com) · [GitHub](https://github.com/ibtisam-iq)

</div>
