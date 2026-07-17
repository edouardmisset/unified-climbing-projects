# Roadmap to v1 Beta

> **Audience**: Closed beta (friends & testers)
> **Timeline**: No rush — do it right
> **Deploy target**: Vercel + Convex

---

## Phase 0 — Foundation: Schema Migration & Data Isolation

_Everything else depends on this. Do it first._

### 0.1 Schema changes

- [ ] Add `userId: v.string()` field to `ascents` and `training` tables (widen — make it optional first)
- [ ] Add `createdAt` / `updatedAt` fields to both tables
- [ ] Add a `users` table for profile metadata (name, email, role, preferences)
- [ ] Add database indexes: `by_userId` on ascents + training, `by_userId_date` composite

### 0.2 Data migration (in-place)

- [ ] Install `@convex-dev/migrations`
- [ ] Write migration: backfill all existing rows with your `userId`
- [ ] Narrow schema: make `userId` required after migration completes
- [ ] Verify: query both tables, confirm every row has a `userId`

### 0.3 Convex auth integration

- [ ] Replace `ClerkProvider` with `ConvexProviderWithClerk` in `layout.tsx`
- [ ] Add `ConvexReactClient` initialization alongside Clerk
- [ ] Verify Clerk JWT → Convex identity flow works (call `ctx.auth.getUserIdentity()` from a test function)

### 0.4 Backend auth guards

- [ ] **Every query**: call `getUserIdentity()`, throw if null, filter by `userId`
- [ ] **Every mutation**: call `getUserIdentity()`, throw if null, attach `userId` to inserts
- [ ] Create a shared `requireAuth(ctx)` helper in `convex/` to DRY the pattern
- [ ] Add `userId` to the return type of queries so the frontend can verify ownership

---

## Phase 1 — Route Restructure & Landing Page

### 1.1 App routing reorganization

- [ ] Move current `/` (wrap-up dashboard) to `/dashboard`
- [ ] Move all app routes under an authenticated layout group (e.g., `(app)/`)
- [ ] Create `(marketing)/` group for public pages
- [ ] Add Next.js middleware (`middleware.ts`) to redirect unauthenticated users from `/dashboard/*` to `/sign-in`

### 1.2 Landing page

- [ ] Build landing page at `/` for signed-out users
- [ ] Key sections: hero, features (log / analyze / visualize), call-to-action (sign up)
- [ ] Beta disclaimer banner: "This app is in beta. Data may be lost or reset."
- [ ] Link to sign-in / sign-up

### 1.3 Auth pages

- [ ] Set up Clerk sign-in page (`/sign-in`)
- [ ] Set up Clerk sign-up page (`/sign-up`)
- [ ] Configure SSO providers: Google, GitHub, Email+Password
- [ ] Add post-sign-up hook to create user record in Convex `users` table

---

## Phase 2 — Security Hardening

### 2.1 API route protection

- [ ] Protect `/api/cron/backup` with a secret API key (`CRON_SECRET` env var) — admin-only
- [ ] Change backup endpoint from GET to POST
- [ ] Add request validation (check headers/body)

### 2.2 Rate limiting

- [ ] Add basic rate limiting to Convex HTTP actions (if using any)
- [ ] Consider Vercel's built-in rate limiting or middleware-level throttling for API routes

### 2.3 Input validation

- [ ] Audit all Convex mutations: ensure Zod schemas validate inputs server-side (already partially done via `zodToConvex`)
- [ ] Ensure no raw user input reaches the database unvalidated

### 2.4 Environment & secrets

- [ ] Swap Clerk test keys (`pk_test_`, `sk_test_`) to production keys before launch
- [ ] Verify `.env` is gitignored (already done)
- [ ] Confirm `env.js` validation catches missing vars at build time

---

## Phase 3 — Data Import & Export

### 3.1 Import from external platforms (must-have)

- [ ] Research 8a.nu export format (CSV structure, field mapping)
- [ ] Research 27crags export format
- [ ] Write a guide: "How to export your data from 8a.nu / 27crags"
- [ ] Build parser: 8a.nu CSV → app's ascent schema
- [ ] Build parser: 27crags CSV → app's ascent schema
- [ ] Build import UI: upload file → preview → confirm → insert into Convex
- [ ] Handle field mapping edge cases (grade systems, discipline naming, date formats)
- [ ] Add validation + error reporting during import ("3 rows skipped, reason: …")

### 3.2 Generic import

- [ ] Support CSV and JSON import for ascents and training sessions
- [ ] Provide a template/sample file for each

### 3.3 Data export (should-have, post-launch OK)

- [ ] Per-user export endpoint: ascents + training sessions as CSV
- [ ] Package as ZIP with 2 CSV files
- [ ] Add export button in user settings / profile
- [ ] GDPR: this doubles as "right to data portability"

---

## Phase 4 — Error Handling & Observability

### 4.1 Sentry integration

- [ ] Install `@sentry/nextjs`
- [ ] Configure Sentry DSN in env vars
- [ ] Add Sentry to `error.tsx` (replace `console.error`)
- [ ] Add Sentry to API routes (backup cron)
- [ ] Add Sentry to Convex functions (if supported, otherwise log to a Convex `errors` table)

### 4.2 Error UX improvements

- [ ] Replace silent failures (empty arrays on error) with user-visible error states
- [ ] Add toast/notification system for mutation errors (e.g., "Failed to save ascent")
- [ ] Add loading states where missing

### 4.3 Monitoring

- [ ] Set up Sentry alerts for error spikes
- [ ] Keep `@vercel/analytics` for usage metrics
- [ ] Consider Convex dashboard monitoring for function performance

---

## Phase 5 — Testing

### 5.1 Backend tests

- [ ] Test auth guards: unauthenticated calls should fail
- [ ] Test data isolation: user A can't see user B's data
- [ ] Test mutations: insert, update with correct userId attachment
- [ ] Test migration: verify backfill correctness

### 5.2 E2E auth flow tests

- [ ] Test sign-up flow (new user → lands on dashboard)
- [ ] Test sign-in flow (existing user → sees their data)
- [ ] Test sign-out flow (redirect to landing)
- [ ] Test unauthorized access (direct URL → redirect to sign-in)

### 5.3 Import/export tests

- [ ] Test 8a.nu CSV parsing (happy path + malformed data)
- [ ] Test 27crags CSV parsing
- [ ] Test export produces valid CSV/ZIP

### 5.4 Expand existing coverage

- [ ] Add tests for form submissions (ascent form, training form)
- [ ] Add tests for error scenarios (network failure, invalid data)
- [ ] Run the full E2E suite against the multi-user setup

---

## Phase 6 — Polish & Pre-Launch

### 6.1 Beta disclaimer

- [ ] Add persistent banner: "Beta — provided as-is, data may be reset"
- [ ] Add to sign-up flow: "By signing up you acknowledge this is a beta"

### 6.2 UI/UX polish

- [ ] Review navigation for multi-user (remove hardcoded "climber" references if any)
- [ ] Add user profile/settings page (change name, manage account)
- [ ] Review mobile responsiveness
- [ ] Check accessibility (keyboard nav, screen reader basics)

### 6.3 Documentation

- [ ] README: update with setup instructions for contributors
- [ ] Import guide: step-by-step for 8a.nu and 27crags users

### 6.4 Pre-launch checklist

- [ ] Swap to production Clerk keys
- [ ] Verify Vercel deployment works with all env vars
- [ ] Run full E2E test suite on preview deploy
- [ ] Manual smoke test: sign up → import data → view dashboard → export
- [ ] Share invite link with beta testers

---

## Dependency Graph

```
Phase 0 (Schema + Auth)
  ├── Phase 1 (Routes + Landing) — needs auth middleware
  ├── Phase 2 (Security) — needs auth in place
  └── Phase 3 (Import/Export) — needs userId in schema
        └── Phase 5.3 (Import tests)

Phase 4 (Sentry) — independent, can start anytime
Phase 5.1-5.2 (Backend + Auth tests) — after Phase 0
Phase 6 (Polish) — after everything else
```

---

## Out of Scope for v1 Beta

- Social features (sharing ascents, public profiles)
- Real-time collaboration / live subscriptions
- Advanced analytics (ML-based projections)
- Native mobile app
- Full legal compliance (privacy policy, ToS, cookie consent) — revisit before public launch
- Performance optimization beyond basics
- Internationalization
