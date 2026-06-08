# React 19 + TypeScript + Vite 7 + Tailwind CSS 3 + react-router-dom 7
# 3-stage: deps -> builder -> production (nginx:alpine, no Node in final image)

ARG NODE_VERSION=22.14-alpine3.21
ARG NGINX_VERSION=1.27.5-alpine3.21

# Injected by CI: --build-arg BUILD_DATE=... --build-arg GIT_SHA=...
ARG BUILD_DATE
ARG GIT_SHA

# -----------------------------------------------------------------------------
# Stage 1 — deps: isolated npm ci layer, cached until lockfile changes
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps

WORKDIR /app

# Lockfile-only copy maximises cache hit rate
COPY package.json package-lock.json ./

# npm ci: exact lockfile install, no range resolution
# --ignore-scripts omitted: esbuild requires its postinstall binary installer
RUN npm ci

# -----------------------------------------------------------------------------
# Stage 2 — builder: tsc -b && vite build -> /app/dist
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# node_modules first: largest layer, changes least often
COPY --from=deps /app/node_modules ./node_modules

# Config files: second-lowest churn, form a stable cache boundary
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY vite.config.ts postcss.config.js tailwind.config.js eslint.config.js ./
COPY index.html ./

# Source last: highest churn, invalidates only the layers below
COPY src ./src
COPY public ./public

# Required for Vite minification + Tailwind CSS purge
ENV NODE_ENV=production

RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3 — production: nginx:alpine serving /app/dist
# Node, npm, tsc — none present in this stage
# -----------------------------------------------------------------------------
FROM nginx:${NGINX_VERSION} AS production

# ARGs re-declared post-FROM to inherit outer scope (Docker scoping rule)
ARG BUILD_DATE
ARG GIT_SHA
LABEL org.opencontainers.image.title="portfolio-site" \
      org.opencontainers.image.description="Ibtisam Iqbal — Portfolio (React 19 + Vite 7 + Tailwind)" \
      org.opencontainers.image.source="https://github.com/ibtisam-iq/portfolio-site" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${GIT_SHA}"

# Drop nginx defaults before injecting hardened config
RUN rm -rf /usr/share/nginx/html/* \
    && rm /etc/nginx/conf.d/default.conf

COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# nginx:alpine runtime dirs default to root ownership; fix before USER drop
RUN chown -R nginx:nginx \
      /var/cache/nginx \
      /var/log/nginx \
      /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080

# SIGQUIT = graceful drain; Docker default SIGTERM hard-kills connections
STOPSIGNAL SIGQUIT

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
