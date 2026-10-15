# Setu Nova

A bilingual, India-wide rural marketplace demo for artisans, farmers, SHGs, forest-product collectors, buyers and equipment renters. Demo prices are illustrative, not verified market rates.

## Local setup

Requires Node.js 22.5 or later (`node:sqlite` is used by the local demo API). Install the locked dependencies and run the Next.js development server:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Next.js (normally `http://localhost:3000`). If port 3000 is already in use, Next.js will choose another port.

The production website is installable from a supported mobile browser as a PWA. On Android, open the HTTPS deployment in Chrome and use **Install app** or **Add to Home screen**. The service worker caches only public static assets and provides a bilingual offline notice; it does not cache account, order, marketplace API or other user data. This is an Android-friendly web app, not a native APK. The legacy `server.js` serves `index.html` on port 8000 and is not the documented Next.js application.

The local SQLite database is created at `.data/setu-nova.sqlite` and persists across development-server restarts. Set `SETU_NOVA_DB_PATH` to a different writable path if needed; see [.env.example](./.env.example). Uploaded demo photos are written to `public/uploads/`. Both locations are git-ignored.

Build and run the production bundle:

```powershell
npm.cmd run build
npm.cmd start
```

Production mode serves the application but deliberately disables demo write APIs and demo image uploads. Deploying live commerce requires authenticated, production-grade services first. The local SQLite file and disk uploads are not suitable for ephemeral/serverless hosting.

## Demo features

- Responsive homepage, desktop/mobile navigation and routes for catalog, seller tools, buyer requests, basket, orders, tracking, wishlist, rentals, profile, help and settings.
- 27 India-wide sample product records; forest/botanical and bamboo records are unpublished pending evidence review, while non-forest demo products are clearly labelled illustrative prices.
- Search suggestions, category/price/seller/location/availability/rating filters, and sorting.
- Local SQLite persistence for seller listings, buyer requests and quotations, demo orders/status history, rental listings and booking requests.
- Seller listing photo upload (JPEG, PNG, WebP; 5 MB maximum), draft storage in the browser, and pause/edit/remove controls.
- Dedicated **Forest Produce & Natural Products** route with subcategories, multi-photo listing details, seller-defined pricing, botanical/source/processing/packaging/date fields, review status, price history and listing audit records.
- Historical Chhattisgarh government MSP references for named products and forms published for collection year 2024–25. These are stored separately from seller prices and never represented as current retail or market rates. If no reliable current reference is available, forest listing prices remain seller-defined and market verification is pending.
- Forest listings are kept out of the buyer catalog and cannot be purchased until the evidence-review workflow approves them. The local demo review action requires document-reference IDs, seller declaration, source/handling fields, genuine uploaded photos and a reviewer note. This does not itself establish legal compliance.
- Demo checkout validates stock, computes subtotal/shipping, creates a unique unpaid order, decrements stock, and restores stock when an eligible order is cancelled.
- English/Hindi switching; basket, wishlist, recently viewed products and preferences persist in the browser.

### Forest product research and safety

Research sources inspected on **2026-10-14**:

- [Chhattisgarh State Minor Forest Produce Federation — MSP information](https://www.cgmfpfed.org/new/msp_scheme.php): publishes Chhattisgarh collection-year 2024–25 MSP figures. They are shown as historical Government MSP references with product form/grade caveats, not as current rates or a guaranteed procurement/retail price.
- [Ministry of AYUSH — e-Charak market prices](https://echarak.ayush.gov.in/marketprice): the interactive page identifies its fortnightly market-price function, but current product rows could not be independently retrieved during this review; no current observed market prices are asserted.
- [TRIFED — MFP marketing guidelines](https://trifed.tribal.gov.in/en/guidelines-0): cited for the minor-forest-produce MSP/value-chain framework.
- [PIB advisory on online sale of certain ASU drugs](https://www.pib.gov.in/PressReleasePage.aspx?PRID=1841493&lang=2&reg=48): the source returned HTTP 403 during review. The marketplace does not claim to implement drug licensing, prescription or legal-compliance checks.

Historical source records are in `lib/forest-market-data.js` and SQLite's `forest_price_references`; seller price changes and review decisions are recorded separately. Sellers must not make medicinal-benefit or cure claims. Product identity, collection/ownership/transit/trade permissions, protected-species restrictions, FSSAI requirements and AYUSH/Drugs and Cosmetics requirements need item- and jurisdiction-specific expert review. A denylist and seller checkbox are not legal screening.

## Explicit limitations before production

- The Android deliverable is currently an installable PWA, not a native Expo application or APK. Offline support is limited to cached public static assets and an offline notice; marketplace data and actions require a connection.
- There is no real authentication, OTP, user/role authorization, protected profile, address book, private buyer/seller messaging, or secure account logout. The local forest admin-review route and mutation API are demo-only and not permission-protected; never expose development mode to the public or treat its review action as legal approval.
- Orders are local demo records marked `DEMO_UNPAID`; no payment gateway, actual courier, shipment scan, delivery confirmation, or return workflow is connected. Tracking only shows recorded demo order/cancellation events.
- Request and quotation actions are demo records without ownership controls. Do not submit real contact details or confidential information; buyer request cards are public in this local demo.
- SQLite state and uploads use the local filesystem; configure a durable managed database/object store and migrations before production.
- No compliance documents are privately uploaded or stored by this demo; the seller enters reference identifiers and the reviewer must inspect the actual evidence out of band. Production requires authenticated roles, private document storage, verified administrative review, jurisdictional rules, restricted-species checks, applicable FSSAI and AYUSH/Drugs and Cosmetics controls, and an auditable legal-compliance process. Until those are connected, do not use the demo for real forest-product sales.
- Ratings/reviews are not seeded; no fabricated customer ratings are shown.
- Product photography and fonts use third-party Unsplash/Google Fonts assets; replace or self-host assets after license and availability review for production.

## Project structure

- `app/manifest.js`, `app/pwa-registration.jsx`, `public/sw.js` — PWA manifest, production service-worker registration and public-static-only caching
- `public/offline.html`, `public/icons/` — bilingual offline fallback and install icons
- `app/marketplace.jsx` — React UI, routes, search and demo workflows
- `app/api/marketplace/route.js` — validated local demo API
- `app/api/uploads/route.js` — constrained demo photo uploads
- `lib/catalog.js` — sample products and rentals
- `lib/forest-market-data.js` — dated government MSP reference records, source citations and forest category definitions
- `lib/database.js` — local SQLite schema and labelled demo seeds
- `app/globals.css` — responsive marketplace design system
- `docs/IMPLEMENTATION_PLAN.md` and `docs/PROJECT_AUDIT.md` — status and limitations
