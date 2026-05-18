# =============================================================================
# Dockerfile — ibtisam-iq/portfolio-site
# Stack: React 19 + TypeScript + Vite 7 + Tailwind CSS 3 + react-router-dom 7
#        react-icons 5 | postcss | eslint
# Strategy: 3-stage multi-stage build  (deps → builder → production)
# DevSecOps: May 2026 hardened
# =============================================================================

# -----------------------------------------------------------------------------
# ARGs: Single source of truth for image versions
# Fix #11 — version never hardcoded in two places; update here, both stages move
# -----------------------------------------------------------------------------
ARG NODE_VERSION=22.14-alpine3.21
ARG NGINX_VERSION=1.27.5-alpine3.21

# Build-time metadata injected by CI/CD pipeline (fix #13 — OCI traceability)
ARG BUILD_DATE
ARG GIT_SHA

# =============================================================================
# Stage 1 — deps
# Purpose: `npm ci` in isolation so node_modules is a cached Docker layer
#          independent of source code changes.
# Fix #1 — NO addgroup/adduser here. Stage 1 only produces a node_modules
#           directory that is COPY --from='d into Stage 2. No process runs;
#           there is nothing to harden with a non-root user in this stage.
# =============================================================================
FROM node:${NODE_VERSION} AS deps

WORKDIR /app

# Copy lock files ONLY — if these are unchanged, this entire layer is cached
COPY package.json package-lock.json ./

# Fix #4 — --ignore-scripts REMOVED.
# esbuild (Vite 7's bundler) installs its platform-specific binary via a
# postinstall script (node_modules/esbuild/install.js). Running --ignore-scripts
# silently skips that script, causing `vite build` to fail with:
#   Error: Cannot find module './install'
# Supply-chain risk is mitigated by: (a) pinned image tags, (b) lockfile-driven
# `npm ci` (exact versions, no range resolution), (c) image digest pinning in
# your CI pipeline (add @sha256:<digest> to the FROM lines for hermetic builds).
RUN npm ci

# =============================================================================
# Stage 2 — builder
# Purpose: TypeScript compile (`tsc -b`) + Vite bundle → /app/dist
# =============================================================================
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# ── Step 1: node_modules from deps stage (large, changes rarely → cached) ────
COPY --from=deps /app/node_modules ./node_modules

# ── Step 2: Config files (changes rarely — good cache boundary) ──────────────
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY vite.config.ts postcss.config.js tailwind.config.js eslint.config.js ./
COPY index.html ./

# ── Step 3: Source directories (changes most frequently — last for cache) ─────
# Fix #2 — Explicit per-directory COPY instead of `COPY . .`
# Eliminates the fragile dependency on .dockerignore to prevent node_modules
# from clobbering the deps stage output. Each directory is named explicitly
# so the Dockerfile is self-documenting about what enters the build context.
COPY src ./src
COPY public ./public

# Vite + Tailwind tree-shaking and minification require NODE_ENV=production
ENV NODE_ENV=production

# `tsc -b && vite build` per package.json scripts.build
# Output → /app/dist  (vite.config.ts: build.outDir = 'dist')
RUN npm run build

# =============================================================================
# Stage 3 — production
# Base: nginx:alpine — serves /app/dist as static files
# Final image has ZERO Node.js, npm, TypeScript, or build tooling
# =============================================================================
FROM nginx:${NGINX_VERSION} AS production

# Fix #12 — LABEL block at the TOP of the stage (before RUN/COPY) per OCI
# convention and Dockerfile best practices. Labels are build-time metadata.
# ARGs must be re-declared after each FROM to inherit outer-scope values.
ARG BUILD_DATE
ARG GIT_SHA
LABEL org.opencontainers.image.title="portfolio-site" \
      org.opencontainers.image.description="Ibtisam Iqbal — Portfolio (React 19 + Vite 7 + Tailwind)" \
      org.opencontainers.image.source="https://github.com/ibtisam-iq/portfolio-site" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${GIT_SHA}"

# Remove nginx defaults — never expose default pages or stock config
RUN rm -rf /usr/share/nginx/html/* \
    && rm /etc/nginx/conf.d/default.conf

# Fix #3 — nginx.conf is already written with `listen 8080` natively.
# No sed post-processing. The config file is the single source of truth.
# sed on a file you control is fragile: silently a no-op if regex misses,
# and produces an untestable intermediate state.
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite-built static assets from builder stage
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Grant nginx user write access to runtime paths (default owner is root)
RUN chown -R nginx:nginx \
      /var/cache/nginx \
      /var/log/nginx \
      /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

# Run as non-root — principle of least privilege (nginx user exists in base image)
USER nginx

EXPOSE 8080

# Fix #15 — SIGQUIT is nginx's graceful shutdown signal.
# SIGQUIT: finish in-flight requests, then exit cleanly.
# Docker default SIGTERM causes nginx to hard-kill active connections — this
# causes dropped requests during K8s rolling deploys / docker stop.
STOPSIGNAL SIGQUIT

# Healthcheck — consumed by K8s liveness/readiness probes, ECS, Docker Swarm
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
