# The Bellmont — website

Single-building site for The Bellmont, 200 Old Carriage Drive, Kitchener (Tower A & Tower B).
Next.js 15 (App Router) · Tailwind 3 · Fraunces + DM Sans · brand per *The Bellmont Brand Guidelines*.

```bash
npm install
npm run dev     # http://localhost:3200
npm run build && npm start
```

## Pages

| Route | What |
| --- | --- |
| `/` | Hero, two towers, featured listings, amenities, gallery, neighbourhood + map, FAQ, contact form |
| `/suites/` | All Bellmont listings with Tower / suite-size filters (`?tower=A` or `?tower=B`) |
| `/suites/[slug]/` | Listing detail: gallery + lightbox, facts, listing copy, live showing slots, Apply Now, similar listings |

## Data — same portal APIs as movesmartrentals.com

All in `src/lib/portal.ts`. Base URL: `NEXT_PUBLIC_PORTAL_BASE_URL` (default `https://portal.revun.com`).

| Use | Endpoint | Where |
| --- | --- | --- |
| Listings | `GET /api/properties?search=old carriage&per_page=100` | server, cached 5 min |
| Listing detail | `GET /api/property/{slug}` | server, page cached 30 min |
| Showing slots | `GET /api/v1/showing/slots/{slug}` | browser |
| Book a slot | `POST /api/v1/showing/store` | browser |
| Request a time (no slots) | `POST /api/v1/showing/submit-lead` | browser |
| Apply Now | `→ /offer/reserve/{slug}` | portal page |
| Contact form | `POST /api/lead-submit` | server, via `/api/contact` |

Listings are portal "adverts" (one card per room/suite type per floor band), so the tour endpoints are called with the listing **slug**, exactly as the MoveSmart site does.

## Caching & images (same as the MoveSmart site)

- Suite pages are not rendered at build time; each is built on its first visit and cached for 30 min. Home and `/suites/` are cached for 5 min.
- A cached page is only refreshed when someone visits after it has gone stale — no visitors, no portal requests. If the portal fails, the last good page keeps being served.
- Images load straight from the portal (`images.unoptimized`), so Vercel's image optimisation quota is never used.

## Env

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata/sitemap (placeholder default: `https://www.thebellmont.ca`) |
| `NEXT_PUBLIC_PORTAL_BASE_URL` | Portal host override |

## Brand

Tokens in `tailwind.config.ts`; logo forms in `src/components/brand/` are the vector paths traced from the guideline PDF (static SVGs in `public/brand/`).
Rules followed: text in Brown, Plum only for the action, Gold for rules, Grey for hairlines, Seafoam text on Bell Blue only ≥ 24px.
