# Setu Nova — Project Audit

## Inspected project state

- Existing app: Next.js 15 / React 19 App Router. Existing home design was retained as a React marketplace and extended instead of introducing another framework.
- Existing server: `server.js` is a legacy static-file server on port 8000. The documented application runs through Next.js scripts (normally port 3000); the static HTML is a separate legacy prototype.
- Database/authentication: none existed before these changes. Local SQLite demo storage was added; there are still no users, real authentication, roles, or authorization.
- Hosting: no deployment adapter or production data service was configured.
- Mobile: the website has an installable PWA shell and offline fallback. There is no native Android app/APK.
- Runtime check: `npm.cmd run dev` starts the documented Next.js app; the homepage and `/api/marketplace` returned HTTP 200 in development. The separate static prototype is served by `node server.js`.
- Tests: no pre-existing unit test suite was found. Run the current production build before deployment; PWA browser-install and offline behavior still need device testing.

## Current implementation

- Routes: homepage and dynamic section/product detail routes; REST endpoints for local demo marketplace actions and constrained image uploads.
- Storage: `.data/setu-nova.sqlite` local database for sample/catalog data, listings, requests, quotes, orders/history, rentals, booking requests, forest source references, seller price history and listing review audit events. Basket, wishlist, recent items, language, region and drafts are browser local storage.
- Initial demo data: 27 product records (forest/bamboo records are unpublished pending compliance review), 3 rental listings, one labelled unpaid sample order and one fictional buyer request.
- Production guard: marketplace POST actions and uploads return `503` under `NODE_ENV=production`.
- Forest module: dedicated category/subcategories, traceable seller price histories and historical Chhattisgarh government MSP references for collection year 2024–25. e-Charak current item prices could not be retrieved; the PIB page returned 403 during source review. No current market rate is claimed.
- Forest listings require review before publication and purchase. Local review decisions and notes are audited; historic MSP data is never used as a seller retail price.

## Important risks / omitted production systems

- No authentication/authorization: all local demo data, seller records and forest review actions are shared on the local app. Document IDs are references only; documents are not privately uploaded or reviewed in the app. Never expose development mode to the public internet or add actual personal data.
- Local SQLite and `public/uploads` require writable persistent storage, are not suited to serverless/ephemeral deployment, and have no migrations/backups/object storage.
- There is no real payment, courier, status-event authority, user address store, messaging, notification delivery, return/refund, review submission or seller verification.
- The protected-product denylist, medical-claim text check and seller compliance checkbox are only demo safeguards, not a substitute for expert review, verified evidence, FSSAI/AYUSH controls or regulatory screening. Demo approval is not legal or government approval.
- External photographs and fonts depend on third-party network availability and require asset/license review.

## Production gate

Do not deploy this demo as a live commerce system. Complete the production milestones in [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md), especially identity/access control, managed storage, payment verification, legal review, persistent deployment infrastructure and automated security/workflow tests.
