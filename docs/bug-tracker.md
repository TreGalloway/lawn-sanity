# Bug Tracker & Solutions

Comprehensive log of all bugs, problems, and their solutions encountered during development.

---

## Bug #1: Docker build fails — package-lock.json not found

**Date:** 2026-04-09
**Severity:** Critical (deployment blocked)
**Symptom:** Railway Docker build fails with:
```
ERROR: failed to build: failed to solve: failed to compute cache key:
"/astro/package-lock.json": not found
```

**Root Cause:** `package-lock.json` was listed in `.gitignore` (line 47), so it was never committed to the repo. Railway builds from git, so the file was missing during `npm ci` in the Dockerfile.

**Solution:**
1. Removed `package-lock.json` from `.gitignore`
2. Committed `astro/package-lock.json` to the repo
3. Pushed to trigger rebuild

**Files changed:** `.gitignore`, `astro/package-lock.json` (added)

---

## Bug #2: Railway health check fails — no /health endpoint

**Date:** 2026-04-09
**Severity:** Critical (deployment fails)
**Symptom:** Build succeeds but health check on `/health` returns 503 for all 8 retry attempts. Deployment rolls back.

**Root Cause:** `railway.toml` configured `healthcheckPath = "/health"` but no `/health` route existed in the Astro app. The server returned 404 for every check.

**Solution:** Created `astro/src/pages/health.ts` that returns a simple 200 OK:
```ts
export async function GET() {
  return new Response('ok', { status: 200 });
}
```

**Files changed:** `astro/src/pages/health.ts` (new)

---

## Bug #3: Service pages show "Internal Server Error"

**Date:** 2026-04-09
**Severity:** Critical
**Symptom:** Clicking any service tab shows the header but page content displays "Internal Server Error". Railway logs show:
```
TypeError: Cannot read properties of undefined (reading 'toLowerCase')
```

**Root Cause:** The `[slug].astro` page was written for static mode (using `getStaticPaths` to pass `serviceName` via props), but the site runs in SSR mode. In SSR, `getStaticPaths` is ignored and `Astro.props.serviceName` is always `undefined`. Calling `.toLowerCase()` on `undefined` throws a TypeError.

Additionally, the hardcoded `serviceInfo` map used `mowing` as a key, but Sanity's slug was `lawn-mowing`, causing slug mismatch.

**Solution:**
1. Removed `getStaticPaths` entirely (not used in SSR)
2. Fetched `serviceName` from Sanity via `fetchServiceBySlug()`
3. Added fallback name derived from the slug
4. Added `lawn-mowing` as an alias in the fallback data map
5. Added explicit `string` type annotation to `serviceName`

**Files changed:** `astro/src/pages/services/[slug].astro`

---

## Bug #4: Sanity content not showing on live site

**Date:** 2026-04-09
**Severity:** Critical
**Symptom:** All content appears as hardcoded fallback data. Edits in Sanity Studio don't reflect on the live site.

**Root Cause:** `import.meta.env.PUBLIC_SANITY_PROJECT_ID` and `import.meta.env.PUBLIC_SANITY_DATASET` are statically replaced at build time by Vite. The Docker build doesn't have access to Railway's runtime environment variables. The Sanity client fell back to `projectId: 'your-project-id'`, so all API queries failed silently (caught by try/catch), and only fallback data was ever displayed.

**Solution:** Changed `sanity.ts` to check `process.env` first (available at runtime in SSR), then fall back to `import.meta.env` (available during local dev):
```ts
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'your-project-id';
const dataset = process.env.PUBLIC_SANITY_DATASET || import.meta.env.PUBLIC_SANITY_DATASET || 'production';
```

**Files changed:** `astro/src/lib/sanity.ts`

---

## Bug #5: Service detail pages don't render Sanity fullDescription

**Date:** 2026-04-09
**Severity:** High
**Symptom:** Service pages only show hardcoded fallback descriptions, even when Sanity has `fullDescription` content (e.g., Fertilizing, Mulching have Portable Text content).

**Root Cause:** `[slug].astro` only used `service.shortDescription` (which is `null` for all services in Sanity). It never rendered `service.fullDescription` (Portable Text), which is where actual editorial content lives.

**Solution:** Added `RichText` component import and conditional rendering:
- If `service.fullDescription` exists and has content → render via `<RichText>`
- Otherwise → show fallback `description` and `features` list

**Files changed:** `astro/src/pages/services/[slug].astro`

---

## Bug #6: @sanity/image-url deprecation warning

**Date:** 2026-04-09
**Severity:** Low
**Symptom:** Build warning: `The default export of @sanity/image-url has been deprecated. Use the named export createImageUrlBuilder instead.`

**Root Cause:** Using default import `import imageUrlBuilder from '@sanity/image-url'` which is deprecated.

**Solution:** Changed to named import:
```ts
import { createImageUrlBuilder } from '@sanity/image-url';
const builder = createImageUrlBuilder(sanityClient);
```

**Files changed:** `astro/src/lib/sanity.ts`

---

## Bug #7: Services sorted by wrong field

**Date:** 2026-04-09
**Severity:** Medium
**Symptom:** Services appear in wrong order on the site.

**Root Cause:** `fetchServices()` sorted by `tabOrder asc`, but `tabOrder` is `null` for all services. The schema defines `displayOrder` as the active field for ordering ("for Services Page Tabs") and `tabOrder` as "Legacy Display Order".

**Solution:** Changed GROQ query to sort by `displayOrder asc`:
```ts
`*[_type == "service"] | order(displayOrder asc)`
```

**Files changed:** `astro/src/lib/sanity.ts`

---

## Bug #8: Page type mismatch — content vs blocks

**Date:** 2026-04-09
**Severity:** High
**Symptom:** About, Privacy, and Terms pages never show Sanity content. LSP errors: `Property 'content' does not exist on type 'Page'`.

**Root Cause:** The `Page` TypeScript interface originally had both `content` and `blocks` fields. A prior change removed `content` from the type, but the Sanity data for all 3 pages stores content in the `content` field (Portable Text), not `blocks` (which is `null`). The code only checked `blocks`, so Sanity content was never found.

**Solution:**
1. Added `content?: any[]` back to the `Page` type
2. Updated all page templates to check `blocks` first (page builder), then `content` (simple Portable Text), then hardcoded fallback
3. Added `content` field to the Sanity page schema so it's editable in Studio

**Files changed:** `astro/src/types/index.ts`, `astro/src/lib/schemas/page.ts`, `astro/src/pages/about.astro`, `astro/src/pages/privacy.astro`, `astro/src/pages/terms.astro`

---

## Bug #9: ServiceAreas shows default data instead of Sanity data

**Date:** 2026-04-09
**Severity:** Medium
**Symptom:** Service areas section always shows hardcoded defaults (Flint, Flint Township, etc.) instead of the areas configured in `siteSettings.serviceAreas`.

**Root Cause:** The `ServiceAreas` component only accepted `ServiceArea[]` objects (with `_id` and `areaName`). But `siteSettings.serviceAreas` is a `string[]` (which had data), while zero `serviceArea` documents existed in Sanity. The homepage only passed `serviceArea` documents, never the siteSettings string array.

**Solution:**
1. Updated `ServiceAreas.astro` to accept both `ServiceArea[]` and `string[]` props, normalizing strings into `{ _id, areaName }` objects
2. Updated `index.astro` to pass `siteSettings.serviceAreas` as fallback when no `serviceArea` documents exist
3. Updated `PageBlocks.astro` to fall back to `siteSettings.serviceAreas` when a serviceAreas block has no areas

**Files changed:** `astro/src/components/ServiceAreas.astro`, `astro/src/pages/index.astro`, `astro/src/components/PageBlocks.astro`

---

## Bug #10: Footer service links use wrong slugs

**Date:** 2026-04-09
**Severity:** Low
**Symptom:** Footer fallback link for "Mowing" goes to `/services/mowing`, but Sanity uses slug `lawn-mowing`.

**Root Cause:** Footer hardcoded fallback used `mowing` as slug, but Sanity's service document uses `lawn-mowing` as the slug.

**Solution:** Changed footer fallback slug from `mowing` to `lawn-mowing`, and name from "Mowing" to "Lawn Mowing" to match Sanity data.

**Files changed:** `astro/src/components/Footer.astro`

---

## Bug #11: ServiceGrid shows empty descriptions and no icons

**Date:** 2026-04-09
**Severity:** Medium
**Symptom:** Service cards on homepage show no description text and no icons when Sanity data is loaded, because all services have `shortDescription: null` and `icon: null`.

**Root Cause:** ServiceGrid fetched services from Sanity but used them directly without fallbacks. Since Sanity services lack `shortDescription` and `icon`, the cards rendered empty.

**Solution:** Added a `FALLBACK_DATA` map keyed by slug that provides default `shortDescription` and `icon` values. When a Sanity service has null fields, the corresponding fallback is used. Includes both `mowing` and `lawn-mowing` slug aliases.

**Files changed:** `astro/src/components/ServiceGrid.astro`

---

## Bug #12: Services index page completely hardcoded

**Date:** 2026-04-09
**Severity:** High
**Symptom:** `/services` page shows hardcoded HTML content, never fetches from Sanity.

**Root Cause:** `services/index.astro` never called `fetchServices()`. All service listings were static HTML.

**Solution:** Rewrote the page to fetch services from Sanity and render them dynamically as clickable cards, with `FALLBACK_DESCRIPTIONS` for when `shortDescription` is null.

**Files changed:** `astro/src/pages/services/index.astro`

---

## Bug #13: No 404 page

**Date:** 2026-04-09
**Severity:** Medium
**Symptom:** Invalid URLs show Astro's default 404 with no branding or navigation.

**Solution:** Created `astro/src/pages/404.astro` with styled "Page Not Found" page, links to Home, Services, and Contact.

**Files changed:** `astro/src/pages/404.astro` (new)

---

## Bug #14: Site settings fields null in Sanity

**Date:** 2026-04-09
**Severity:** Medium
**Symptom:** Hero title/subtitle, footer tagline, and address show generic fallback text instead of branded content.

**Root Cause:** `heroTitle`, `heroSubtitle`, `footerTagline`, and `address` fields were `null` in the Sanity siteSettings document.

**Solution:** Populated via Sanity API:
- `heroTitle`: "Professional Lawn Care Services"
- `heroSubtitle`: "Serving Flint, MI and surrounding areas with honest, reliable lawn care"
- `footerTagline`: "Your trusted local lawn care experts in Flint, MI"
- `address`: "2959 Mallory Street, Flint, Michigan 48504"

**No code changes** — data update only.
