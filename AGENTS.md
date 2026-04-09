# Agent Instructions

## Project Overview

MI Premier Lawn Care website - an Astro 5 static site with embedded Sanity CMS.

## Project Structure

```
lawn-sanity/
├── astro/                    # Astro frontend
│   ├── src/
│   │   ├── components/      # UI components (.astro and .tsx)
│   │   ├── layouts/         # Page layouts
│   │   ├── lib/
│   │   │   ├── schemas/      # Sanity schemas (for embedded studio)
│   │   │   ├── sanity.ts     # Sanity client
│   │   │   └── sanity.config.ts  # Sanity Studio config
│   │   ├── pages/           # Astro pages
│   │   └── types/           # TypeScript types
│   └── package.json
├── sanity/                   # Sanity Studio (standalone, for local dev)
│   └── schemas/             # Original schemas
├── docs/                    # Documentation
│   ├── railway-deployment-troubleshooting.md
│   └── railway-deployment-healthcheck.md
├── Dockerfile               # Multi-stage Docker build
├── nginx.conf.template      # Nginx config template
├── start.sh                # Container startup script
├── railway.toml             # Railway deployment config
└── .dockerignore           # Docker build ignore
```

## Sanity Integration

### Embedded Studio (Production)
- Sanity Studio is embedded in Astro at `/admin`
- Schemas are in `astro/src/lib/schemas/`
- Config is in `astro/src/lib/sanity.config.ts`

### Standalone Studio (Development)
- Local development can use `sanity/` directory
- Run `cd sanity && npm run dev` for standalone studio

### Sanity Credentials
- Project ID: `u4dmbqdq`
- Dataset: `production`
- Studio URL: `https://u4dmbqdq.sanity.studio`

## Railway Deployment

### Key Files for Deployment
- `Dockerfile` - Multi-stage build (Node.js builder, nginx runtime)
- `nginx.conf.template` - Uses `${PORT}` variable (set by Railway)
- `start.sh` - Startup script using `envsubst`
- `railway.toml` - Deployment configuration

### Railway Environment Variables
```
PUBLIC_SANITY_PROJECT_ID = u4dmbqdq
PUBLIC_SANITY_DATASET = production
PORT = 8080 (set automatically)
NODE_VERSION = 22
```

### Deployment Commands
1. Push to GitHub
2. Railway auto-deploys from main branch
3. Healthcheck runs at `/health`

## Common Tasks

### Adding a New Sanity Schema
1. Create schema in `astro/src/lib/schemas/` (e.g., `newType.ts`)
2. Export from `astro/src/lib/schemas/index.ts`
3. Import in `astro/src/lib/sanity.config.ts`
4. Commit and push

### Updating Content Types
1. Edit schema in `astro/src/lib/schemas/`
2. Push to deploy
3. Sanity Studio at `/admin` reflects changes

### Local Development
```bash
# Install dependencies
cd astro && npm install

# Start dev server
npm run dev
```

## Build Commands
```bash
# Local build
cd astro && npm run build

# Preview production build
cd astro && npm run preview
```

## Troubleshooting

### Healthcheck Failing
- Check `nginx.conf.template` uses `${PORT}`
- Verify `start.sh` runs `envsubst`
- Ensure `railway.toml` has `healthcheckPath = "/health"`

### Build Failing
- Check Node.js version (should be 22)
- Verify dependencies in `astro/package.json`
- Check for TypeScript errors

### Sanity Not Loading
- Verify `PUBLIC_SANITY_PROJECT_ID` environment variable
- Check browser console for CORS errors
- Verify schemas are properly imported

## Documentation

- `docs/railway-deployment-healthcheck.md` - Healthcheck issue details
- `docs/railway-deployment-troubleshooting.md` - Full troubleshooting log
