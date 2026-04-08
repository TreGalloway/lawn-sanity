# MI Premier Lawn Care - Astro + Sanity

## Project Structure

```
lawn-sanity/
├── astro/              # Astro frontend (deploys to Railway)
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── layouts/    # Page layouts
│   │   ├── lib/        # Sanity client
│   │   ├── pages/      # Astro pages
│   │   └── types/      # TypeScript types
│   └── public/          # Static assets
├── sanity/             # Sanity Studio (hosted at sanity.studio)
│   ├── schemas/         # Content schemas
│   └── sanity.config.ts
└── railway.toml         # Railway deployment config
```

## Quick Start

### 1. Install Dependencies

```bash
# Astro frontend
cd astro && npm install

# Sanity Studio
cd sanity && npm install
```

### 2. Environment Variables

Copy the example files and update with your Sanity credentials:

```bash
cp astro/.env.example astro/.env
cp sanity/.env.example sanity/.env.local
```

### 3. Run Development

```bash
# Terminal 1: Sanity Studio (optional - or use hosted version)
cd sanity && npm run dev

# Terminal 2: Astro Frontend
cd astro && npm run dev
```

## Deployment

### Railway (Astro Frontend)

1. Connect your GitHub repo to Railway
2. Add environment variables:
   - `PUBLIC_SANITY_PROJECT_ID` = your Sanity project ID
   - `PUBLIC_SANITY_DATASET` = production
3. Railway auto-detects Astro from `railway.toml`

### Sanity Studio

Access your hosted studio at: `https://[project-id].sanity.studio`

Or deploy a custom domain:
```bash
cd sanity
npx sanity deploy
```

## Environment Variables

### Astro (.env)
```
PUBLIC_SANITY_PROJECT_ID=your-project-id
PUBLIC_SANITY_DATASET=production
```

### Sanity (.env.local)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Content Types

- **Service**: name, slug, description, icon, pricing
- **ServiceArea**: areaName, displayOrder
- **GalleryItem**: title, image, description, date
- **SiteSettings**: company info, contact details, hero content
- **Page**: dynamic pages with content blocks

## Color Scheme

- Primary: Kelly Green (#4CBB17)
- Accent: Yellow (#eab308)
