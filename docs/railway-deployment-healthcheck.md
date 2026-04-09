# Railway Deployment Issue #1 - Healthcheck Failure

**Date:** April 8-9, 2026  
**Project:** MI Premier Lawn Care (Astro + Sanity)  
**Stack:** Astro 5 (SSG) + Sanity (embedded CMS) + Nginx

---

## Symptom

Railway deployments were building successfully but failing the healthcheck with "service unavailable" errors. The Docker build completed but the container never became healthy.

```
====================
Starting Healthcheck
====================
Path: /
Retry window: 2m0s

Attempt #1 failed with service unavailable. Continuing to retry for 1m49s
Attempt #2 failed with service unavailable. Continuing to retry for 1m38s
Attempt #3 failed with service unavailable. Continuing to retry for 1m26s
Attempt #4 failed with service unavailable. Continuing to retry for 1m12s
Attempt #5 failed with service unavailable. Continuing to retry for 54s
Attempt #6 failed with service unavailable. Continuing to retry for 28s

1/1 replicas never became healthy!
Healthcheck failed!
```

---

## Root Cause

Railway assigns a random `PORT` environment variable to each service at runtime (typically 8080 or similar). The original Dockerfile had nginx hardcoded to listen on port 80:

```dockerfile
# Original problematic config
RUN echo 'server { listen 80; ... }' > /etc/nginx/conf.d/default.conf
```

Since Railway routes external traffic to the assigned PORT (not 80), nginx was listening on the wrong port. The healthcheck requests hit the assigned port where nothing was listening → "service unavailable".

---

## Resolution

### Solution: Use envsubst with PORT variable

Based on lessons learned from a previous project (see docs/railway-deployment-troubleshooting.md), we implemented the following approach:

### 1. Create nginx config template (`nginx.conf.template`)

```nginx
server {
    listen ${PORT};
    server_name _;
    port_in_redirect off;
    absolute_redirect off;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/index.html =404;
    }

    location = /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
```

### 2. Create startup script (`start.sh`)

```bash
#!/bin/bash

# Use Railway's PORT or default to 8080
export PORT=${PORT:-8080}

# Generate nginx config from template with actual PORT value
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx immediately (so health checks pass from second 0)
nginx -g 'daemon off;'
```

### 3. Update Dockerfile

```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY astro/package.json astro/package-lock.json* ./
RUN npm install
COPY astro/ ./
RUN npm run build

# Runtime stage
FROM nginx:alpine
RUN apk add --no-cache gettext curl bash
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY start.sh /start.sh
RUN chmod +x /start.sh
EXPOSE 8080
CMD ["/start.sh"]
```

### 4. Update railway.toml

```toml
[build]
builder = "DOCKERFILE"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 120
restartPolicyType = "ON_FAILURE"

[environment]
NODE_VERSION = "22"
PORT = 8080
```

---

## Key Takeaways

1. **Never hardcode ports in Docker containers for Railway** - Always use the `PORT` environment variable

2. **Use envsubst** - The `gettext` package provides `envsubst` which replaces template variables at runtime

3. **Start nginx immediately** - Health checks need a responding server from second 0

4. **Dedicated healthcheck endpoint** - A `/health` endpoint that returns 200 is more reliable than expecting the root path to work

5. **Use port_in_redirect off** - Prevents internal ports from leaking into redirect headers

---

## Files Changed

| File | Action |
|------|--------|
| `Dockerfile` | Rewrote with startup script approach |
| `nginx.conf.template` | Created - template with `${PORT}` variable |
| `start.sh` | Created - startup script with envsubst |
| `.dockerignore` | Created - reduces build context |
| `railway.toml` | Updated - healthcheck path and PORT |

---

## References

- Previous project deployment doc: `docs/railway-deployment-troubleshooting.md`
- Railway documentation: https://docs.railway.app
