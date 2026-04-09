# Railway Deployment Troubleshooting Log

This document records issues encountered deploying the MI Premier Lawn Care site (Astro SSG + Sanity) to Railway, and exactly how each was resolved.

**Stack:** Astro 5 (SSG frontend) + Sanity (embedded CMS) + Nginx

---

## Issue 1 — PORT conflict: nginx hardcoded to port 80

**Symptom:** Health checks failing with "service unavailable". Railway assigns a random `PORT` (e.g. 8080) to services at runtime, but nginx was hardcoded to `listen 80;`.

**Cause:** `nginx.conf` had a static `listen 80;` directive. Railway routes external traffic to whatever port the container is listening on — since nothing was on the Railway-assigned port, all requests were rejected.

**Fix:**
- Created `nginx.conf.template` with `listen ${PORT};`
- Created `start.sh` to run `envsubst` and start nginx with the correct port
- Added `gettext` package (provides `envsubst`) to Dockerfile
- Set healthcheck path to `/health` (dedicated endpoint)
- Added `port_in_redirect off;` and `absolute_redirect off;` to prevent port leakage

---

## Issue 2 — Embedded Sanity Studio at /admin

**Symptom:** Need to access Sanity Studio at `mipremierlawncare.com/admin` on the same domain.

**Cause:** Sanity provides hosted studios at `*.sanity.studio` but user wanted same-domain access.

**Fix:**
- Added React integration to Astro (`@astrojs/react`)
- Created embedded Sanity Studio component in `astro/src/components/AdminStudio.tsx`
- Created Sanity config in `astro/src/lib/sanity.config.ts`
- Copied schemas to `astro/src/lib/schemas/` for local access
- Created `/admin` page at `astro/src/pages/admin.astro`

---

## Issue 3 — Dependency conflicts during npm install

**Symptom:** `npm install` failed with ERESOLVE errors - dependency conflicts.

**Cause:** `@astrojs/tailwind@6.x` only supports Astro 3, 4, and 5, but project had Astro 6.

**Fix:**
- Downgraded Astro from 6.x to 5.x in `package.json`
- All integrations remained compatible

---

## Issue 4 — Build system confusion (Nixpacks vs Dockerfile)

**Symptom:** Railway kept trying to use Nixpacks instead of Dockerfile.

**Cause:** Railway was detecting the monorepo structure and failing to recognize Dockerfile.

**Fix:**
- Updated `railway.toml` with explicit `builder = "DOCKERFILE"`
- Created `.dockerignore` to reduce build context
- Eventually Railway properly detected the Dockerfile after cache clear

---

## Issue 5 — Import path errors in Sanity config

**Symptom:** Build failed with "Could not resolve ./schemas/service".

**Cause:** `sanity.config.ts` in `astro/src/lib/` was importing from `./schemas/` but schemas weren't copied into the Astro project.

**Fix:**
- Copied all schema files from `sanity/schemas/` to `astro/src/lib/schemas/`
- Updated imports in `sanity.config.ts` to use correct relative paths

---

## Final Working Architecture

**Docker image:** Multi-stage build — builder stage compiles Astro, runtime stage is clean Alpine with only nginx.

```
Railway edge (HTTPS:443)
    → container:${PORT} (nginx)
        → /health                → return 200 directly (Railway health check)
        → /admin                 → Embedded Sanity Studio (React component)
        → /*                     → Static Astro files
```

**Container startup sequence:**
1. `start.sh` runs `envsubst` to replace `${PORT}` in nginx config
2. nginx starts immediately on Railway-assigned PORT
3. Railway health checks pass from second 0

---

## Railway Environment Variables Required

| Variable | Purpose | Value |
|----------|---------|-------|
| `PORT` | Railway-assigned port | Auto-set by Railway (default: 8080) |
| `NODE_VERSION` | Node.js version | 22 |
| `PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | `u4dmbqdq` |
| `PUBLIC_SANITY_DATASET` | Sanity dataset | `production` |

---

## Files Reference

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build with startup script |
| `nginx.conf.template` | Nginx config with `${PORT}` variable |
| `start.sh` | Startup script with envsubst |
| `.dockerignore` | Reduces Docker build context |
| `railway.toml` | Railway deployment configuration |
| `astro/src/lib/sanity.config.ts` | Sanity Studio configuration |
| `astro/src/components/AdminStudio.tsx` | Embedded Sanity Studio React component |
| `astro/src/pages/admin.astro` | /admin page |
| `astro/src/lib/schemas/` | Sanity schemas for embedded studio |
