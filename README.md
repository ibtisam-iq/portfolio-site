# Ibtisam IQ — Engineering Portfolio

![Build](https://github.com/ibtisam-iq/portfolio-site/actions/workflows/deploy.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0F172A?logo=tailwindcss)
![Infrastructure](https://img.shields.io/badge/Infrastructure-0B0F19)
![Cloud](https://img.shields.io/badge/Cloud-0B0F19)
![DevOps](https://img.shields.io/badge/DevOps-0B0F19)
![Systems](https://img.shields.io/badge/Systems-0B0F19)

---

Personal engineering portfolio of **Muhammad Ibtisam Iqbal**, focused on cloud infrastructure, Kubernetes, and production-style system design.

This repository powers the main portfolio site and acts as the **entry point** to a larger engineering knowledge ecosystem.

🌐 **Live site:** https://ibtisam-iq.com

---

## Engineering Ecosystem Overview

This portfolio is intentionally split into **multiple subdomains**, each serving a clear engineering purpose.  
The main site provides context and navigation — detailed content lives in the respective domains.

### Subdomains

| Subdomain | Purpose |
|---------|--------|
| **docs.ibtisam-iq.com** | Long-form technical documentation, system breakdowns, design notes |
| **projects.ibtisam-iq.com** | Production-style infrastructure and cloud projects |
| **blogs.ibtisam-iq.com** | Engineering articles and technical reflections |
| **achievements.ibtisam-iq.com** | Milestones, and professional achievements |
| **roadmaps.ibtisam-iq.com** | Engineering career paths and learning roadmaps |
| **cert-prep.ibtisam-iq.com** | Deep certification preparation notes (CKA, CKAD, etc.) |

Each subdomain is deployed independently to keep concerns isolated and scalable.

---

## Tech Stack

**Frontend**
- React (TypeScript)
- Vite
- Tailwind CSS

**Routing**
- React Router

**Hosting & Delivery**
- GitHub Pages (subdomains)
- Cloudflare DNS

**Tooling**
- ESLint
- PostCSS
- GitHub Actions (build & deploy)

---

## Project Structure

```text
portfolio-site/
├── public/                # Static assets, favicon, manifest
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-level pages
│   ├── data/              # Structured data (certificates, etc.)
│   ├── App.tsx            # App shell
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML entry (SEO, meta, favicon)
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

The structure is intentionally **flat and explicit** to keep navigation, maintenance, and scalability predictable.

---

## Design Philosophy

* Systems before tools
* Clarity over cleverness
* Explicit structure over abstraction
* Documentation is part of the system, not an afterthought
* Production-style decisions even in personal projects

This site evolves incrementally — unfinished sections are intentional, not neglected.

---

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Deployment Model

* Main site and subdomains are deployed independently
* Static builds served via GitHub Pages
* DNS and HTTPS handled by Cloudflare
* No server-side rendering by design (predictable, fast, simple)

---

## Project Status

This portfolio is **actively evolving**.

New systems, documentation, and projects are added incrementally as they reach
a production-ready standard.

---

## License

MIT License

### Muhammad Ibtisam