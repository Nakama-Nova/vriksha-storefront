# Vriksha Studio storefront

The public website for Vriksha Studio: wood furniture and carvings. Next.js (App Router, TypeScript) talking to the shop's backend, [nakamadesk-backend](https://github.com/Nakama-Nova/nakamadesk-backend), through its `/public/*` API.

## What it does

| Page | Notes |
|---|---|
| `/` | Hero, shop by craft, featured pieces |
| `/shop`, `/shop/[slug]` | Catalogue with search and category filter; product page with photos, **3D view** (`<model-viewer>`, loaded only when opened), add to cart, Google product data |
| `/cart`, `/checkout`, `/thanks` | Cart in the browser, pincode check, guest checkout, confirmation |
| `/custom` | Custom-piece enquiry |
| `/track` | Order status by order number **and** phone (the phone is never put in a URL) |
| `/contact` | Phone / WhatsApp |

**No online payment yet.** Checkout creates a draft order; staff confirm by phone and the customer pays an advance by UPI. Prices are always set by the server, never by the browser.

## Run it

```bash
cp .env.example .env.local      # then edit
npm install
npm run dev                     # http://localhost:3000
```

Checks: `npm run lint`, `npx tsc --noEmit`, `npm run build`.

### Settings (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend address, e.g. `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_SITE_URL` | This site's public address |
| `NEXT_PUBLIC_WHATSAPP` | Shop WhatsApp number (digits). Empty: product pages link to the enquiry form instead |
| `NEXT_PUBLIC_PHONE` | Shown in the footer and on `/contact` |
| `NEXT_PUBLIC_UPI_ID` | Shown after checkout. Empty: "we will share the UPI details" |

### Backend settings this site needs

The browser calls the backend directly (so the backend sees each visitor's real address for rate limiting). On the backend set:

- `CORS_ORIGINS` to this site's address (e.g. `https://yourshop.in`)
- `DELIVERY_PINCODES` to the pincodes you deliver to
- run uvicorn with `--proxy-headers` behind your proxy

## How it is built

- Server components fetch the catalogue with a 60-second cache, so pages are fast and a price change shows within a minute. If the backend is down, pages show a notice instead of failing (the build also works with no backend).
- The cart is in `localStorage` (`lib/cart.tsx`, via `useSyncExternalStore`).
- Brand colours and fonts come from `nakamadesk-backend/docs/brand/design-tokens.json`, as CSS variables in `app/globals.css`.
- Photos come from the backend's `/media`; the site uses plain `<img>` (they are already sized by staff).
- This project turns off Next 16's Cache Components (`next.config.ts`) and uses classic revalidating `fetch`.

## Deploy (Vercel)

Import the repo, set the variables above, deploy. Add the Vercel/custom domain to the backend's `CORS_ORIGINS`.

## Not built yet

- Logo image in the header (a gold circle stands in; needs a transparent PNG/SVG)
- Reference-photo upload on the enquiry form
- Online payments (waiting for the trade licence / GST registration)

## Licence

Proprietary software. Copyright (c) 2026 Nakama Nova, all rights reserved. It may not be copied, modified or shared; see `LICENSE`. Third-party packages keep their own licences.
