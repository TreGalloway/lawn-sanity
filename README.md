# MI Premier Lawn Care - Astro + Sanity

## Project Structure

```
lawn-sanity/
├── astro/              # Astro frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── layouts/    # Page layouts
│   │   ├── lib/       # Sanity client
│   │   ├── pages/     # Astro pages
│   │   └── types/      # TypeScript types
│   ├── public/         # Static assets
│   └── astro.config.mjs
├── sanity/             # Sanity Studio
│   ├── schemas/        # Content schemas
│   └── sanity.config.ts
└── docs/               # Documentation
```

## Quick Start

### 1. Set up Sanity

```bash
cd sanity
npm install
```

Create a Sanity project at https://sanity.io and get your project ID.

```bash
npx sanity init --env
```

### 2. Set up Astro

```bash
cd astro
npm install
cp .env.example .env
# Edit .env with your Sanity project ID
```

### 3. Run Development

```bash
# Terminal 1: Sanity Studio
cd sanity && npm run dev

# Terminal 2: Astro
cd astro && npm run dev
```

## Environment Variables

### Astro (.env)
```
PUBLIC_SANITY_PROJECT_ID=your-project-id
PUBLIC_SANITY_DATASET=production
```

## Deployment

### Vercel (Recommended)
```bash
cd astro
vercel
```

Add environment variables in Vercel dashboard.

### Sanity
```bash
cd sanity
sanity deploy
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
# lawn-sanity
