# Agent Instructions

## Project Overview

MI Premier Lawn Care website - Astro 5 with SSR and embedded Sanity CMS.

## Architecture (Updated)

- **SSR Mode**: Site runs on Node.js server (not static)
- **Real-time content**: Changes in Sanity appear instantly (no rebuild needed)
- **Deployment**: Railway with Node server runtime

## Project Structure

```
lawn-sanity/
├── astro/                    # Astro frontend (SSR)
│   ├── src/
│   │   ├── components/      # UI components (.astro and .tsx)
│   │   ├── layouts/         # Page layouts
│   │   ├── lib/
│   │   │   ├── schemas/      # Sanity schemas
│   │   │   ├── sanity.ts     # Sanity client
│   │   │   └── sanity.config.ts  # Sanity Studio config
│   │   ├── pages/           # Astro pages
│   │   └── types/           # TypeScript types
│   └── package.json
├── Dockerfile               # SSR Node server build
├── railway.toml             # Railway deployment config
└── start.sh                 # (legacy, not used in SSR mode)
```

## Key Commands

```bash
# Install dependencies
cd astro && npm install

# Dev server (SSR)
npm run dev

# Build (creates SSR output)
npm run build

# Start SSR server locally
npm run start

# Preview production build
npm run preview
```

## Deployment

1. Push to GitHub main branch
2. Railway auto-deploys
3. SSR Node server starts on port 8080

**Important**: Dockerfile uses `node dist/server/entry.mjs` to run SSR, not nginx.

## Sanity Integration

- **Studio**: Embedded at `/admin`
- **Project ID**: `u4dmbqdq`
- **Dataset**: `production`
- **Content**: All pages, services, site settings editable via Sanity

### Editing Content

1. Go to `/admin`
2. Edit content in Sanity Studio
3. Changes appear instantly on live site (SSR fetches on each request)

## Common Tasks

### Adding a New Sanity Schema
1. Create schema in `astro/src/lib/schemas/`
2. Export from `astro/src/lib/schemas/index.ts`
3. Import in `astro/src/lib/sanity.config.ts`
4. Deploy schema: `npx sanity schema deploy` (or push code to trigger build)

### Updating Site Settings
- Edit at `/admin` under "Site Settings"
- Fields: company name, phone, email, address, hours, service areas, nav links, contact page text

### Updating Services/Pages
- Edit at `/admin` under "Services" or "Pages"
- Changes reflect immediately (SSR)

## Sanity API Tools

Use these tools for Sanity operations:
- `Sanity_query_documents` - Query content
- `Sanity_get_document` - Fetch single document
- `Sanity_patch_document_from_json` - Update fields
- `Sanity_create_documents_from_json` - Create content
- `Sanity_publish_documents` - Publish drafts

## Known Issues

### TypeScript Errors (Non-blocking)
Some LSP errors may appear in IDE for SiteSettings/Page types. These are type definition mismatches that don't affect runtime. Build will succeed.

### Docker Build Issues
- Use explicit filenames in Dockerfile COPY (e.g., `package.json`, not `package*`)
- `npm ci` requires package-lock.json to exist

## Local Development

```bash
cd astro
npm install
npm run dev     # Start dev server at localhost:4321
npm run build   # Build SSR output
npm run start   # Run production SSR server
```