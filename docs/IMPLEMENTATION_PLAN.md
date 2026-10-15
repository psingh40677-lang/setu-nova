# Setu Nova — Implementation Plan

## Current status

The project runs on Next.js App Router and React. The homepage and each requested navigation destination resolve to a route. The UI is responsive and supports English/Hindi; the main catalog, seller, request/quotation, order and rental demo flows persist in local SQLite. Browser-only preferences, wishlist, basket and seller drafts use local storage. The website now has an installable PWA manifest and production service worker for Android browsers. Its offline fallback is bilingual; only public static assets are cached, never API responses or user data.

## Delivery milestones

### Milestone 1 — Mobile install and low-bandwidth shell (implemented)

- Add web-app metadata, an installable manifest and Setu Nova icons.
- Register the service worker only in production.
- Cache public static assets only; never cache navigations, marketplace APIs, orders or other user-specific responses.
- Show a small bilingual offline page when a navigation cannot reach the server.
- This is an installable web app, not a native Android package. Offline marketplace actions are not available.

### Next milestones — production capabilities (not implemented)

1. Add secure buyer/seller registration and sessions, then facilitator/admin onboarding through a controlled process; enforce role and record ownership on every private read and write.
2. Add automated tests for auth, authorization, input validation, cross-user isolation and core marketplace workflows.
3. Replace local SQLite and disk uploads with managed PostgreSQL, migrations, private object storage, backups and retention controls.
4. Integrate sandbox payments through an actual provider adapter and verified webhooks; until then, checkout is explicitly demo-only and unpaid.
5. Add real courier event sources and auditable tracking updates; until then, tracking remains demo event history.
6. Connect verified, dated market-price sources and real AI providers with consent, rate limits and output controls; no live market-price or AI service currently exists.
7. Build and test the native Android app (Expo/React Native) against the secured backend; the PWA is the current mobile install milestone.
8. Add village collection hubs only after partner locations, services and operating details are verified.
9. Complete compliance, privacy, monitoring, security review and deployment readiness before any live commerce.

## Implemented demo scope

- India-wide catalog seeded with 27 example products and 3 equipment/tool rentals, image alt text and a graceful local placeholder.
- Product search suggestions; category, max-price, seller, location, stock and rating filters; price/newest/popularity sort controls; product details and related listings.
- English/Hindi switching, delivery-region selector, mobile sidebar, seller promotions, featured/bestseller/new-arrival/offer/recommended/recently-viewed sections, and seeded sample producer groups.
- Seller photo upload, validated listing fields, source/compliance declarations for forest/herbal listings, local drafts, publish/edit/pause/remove actions and stock management.
- Buyer request creation, quotations, quote acceptance, request closure/cancellation and public request cards without private buyer contact data.
- Browser-persisted basket and local SQLite demo checkout with stock checks, shipping estimate, unique order IDs, unpaid status, event history and cancellation with inventory restoration.
- Rental booking requests with dates and demo owner approve/reject/cancel status controls.
- Forest produce and natural products category/subcategories, seller-defined-price records, dated Chhattisgarh collection-year 2024–25 government MSP references, and separate seller price-history/source/audit tables. Existing forest and bamboo sample records are unpublished until review.
- Forest seller listings enter `PENDING_REVIEW`; review actions can approve, reject, suspend or request corrections, and audit notes are retained. Approval requires evidence-reference identifiers, seller declaration, product/source fields and genuine uploaded photos. Approved listings integrate with the existing catalog, wishlist, basket, checkout and tracking workflows.
- Product-specific historical MSP references include source/state/collection-year/form/grade/processing/unit and accessed date. e-Charak current rows were not retrievable and the cited PIB advisory returned 403, so neither is represented as a current price or automated legal check.
- A labelled sample order and sample buyer request are seeded. No fabricated shipping events or customer ratings/reviews are seeded.
- Demo write APIs and image uploads are disabled when `NODE_ENV=production`.

## Not production-ready / next milestones

1. Add identity and access management, phone verification, role-based authorization, ownership checks, session security and account recovery.
2. Move SQLite and disk uploads to a managed database, migrations and object storage with backups and retention controls.
3. Add payment-provider order creation, verified webhooks, reconciliation/refunds and idempotency.
4. Add real shipping addresses, courier integrations, authenticated seller/admin tracking updates, delivery and eligible return/cancellation workflows.
5. Add privacy-protected messages, notifications, reviews, seller verification, moderation and complete status workflows.
6. Before any real forest listing is approved, add authenticated seller/admin identities, private compliance-document upload/retrieval, reviewer authorization and a jurisdiction-aware legal/compliance process for collection, ownership, transit, trade, protected species, FSSAI and AYUSH/Drugs and Cosmetics requirements. The local review route is not permission-protected; its decisions are demo-only.
7. Obtain current e-Charak observations through an approved integration or manual source verification, store effective dates/forms/grades and expire stale records. The historic 2024–25 MSP references must not be treated as current retail rates.
8. Add a test suite, CI, monitoring, rate limits, security headers and production deployment configuration.

## Local development

Requires Node.js 22.5+ for the built-in SQLite API. Follow the commands and optional `SETU_NOVA_DB_PATH` configuration in [README.md](../README.md). Production mode intentionally disables the demo mutation/upload routes until secured services exist.
