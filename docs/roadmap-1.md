# Roadmap to v1 Beta – Multi-User Climbing App

**Status**: Planning phase  
**Target**: Closed beta with controlled testers  
**Timeline**: Flexible (prioritize quality)  
**Deployment**: Vercel

---

## Executive Summary

The app currently has **no user data isolation** (critical blocker). This roadmap prioritizes:

1. Schema migration + auth integration (Phase 1)
2. Security hardening (Phase 5)
3. Data import from competing platforms (Phase 3)
4. Landing page & beta messaging (Phase 4)
5. Testing, observability, and polish (Phases 6-8)

**Total work**: ~4–6 weeks for a secure closed beta launch.

---

## Critical Findings

### 🔴 Blocking Issues

- **No Convex-Clerk integration**: Clerk is installed for frontend auth, but backend has zero auth guards
- **No data isolation**: No `userId` field in schema → all data globally visible to all signed-in users
- **No backend testing**: Convex functions untested; auth flows untested

### ⚠️ High Priority

- Schema migration tooling not set up (need `@convex-dev/migrations` package)
- Minimal E2E test coverage (only smoke tests)
- No rate limiting or error logging

### ✅ Already Good

- Strong unit test coverage on domain logic (43 test files)
- Clerk frontend provider installed
- Zod validation patterns in place
- Vercel deployment ready

---

## Phase 1: Core Auth & Data Isolation (Blocking – Week 1)

These must ship first; all later work depends on them.

### 1.1 Schema Migration Setup

- Install `@convex-dev/migrations` package
- Plan widen-migrate-narrow approach:
  - **Widen**: Add `users` table, add `userId` field to `ascents` and `training` (nullable)
  - **Migrate**: Backfill existing docs with userId mapping (based on sign-in time or default user)
  - **Narrow**: Make `userId` required, remove old fallback logic

**Files**:

- `convex/schema.ts` – Add `users` table, `userId` field to existing tables, indexes
- `convex/migrations/001_add_users_table.ts` *(new)* – Migration config

**Verification**: `bun run convex:dev` runs without errors; migration completes in staging

### 1.2 Schema Changes (Implementation)

- Add `users` table with fields: `clerkId` (unique), `email`, `name`, `createdAt`
- Add `userId` (references users) to `ascents` and `training`
- Create index on `userId` for query performance
- Backfill: Assign all existing docs to a default user or prompt on first login

**Files**:

- `convex/schema.ts` – Schema update
- `convex/_generated/dataModel.d.ts` – Auto-updated by Convex CLI

### 1.3 Integrate Convex-Clerk

- Replace `ClerkProvider` with `ConvexProviderWithClerk` in root layout
- Add `middleware.ts` to redirect unauthenticated users from protected routes
- Update [src/app/layout.tsx](../src/app/layout.tsx) with proper provider setup

**Files**:

- `src/app/layout.tsx` – Update providers
- `src/middleware.ts` *(new)* – Auth redirect logic

**Verification**:

- Unauthenticated users redirected to sign-in
- Signed-in users can access app

### 1.4 Add Auth Guards to All Convex Functions

- Use `getIdentity(ctx)` in every query/mutation
- Filter results by `userId`, throw on unauthorized access
- Update existing functions + any new ones

**Files**:

- `convex/ascents.ts` – Add `getIdentity()` calls, filter queries by userId
- `convex/training.ts` – Add `getIdentity()` calls, filter queries by userId

**Example**:

```typescript
export const getAllAscents = query({
  args: {},
  handler: async (ctx) => {
    const identity = await getIdentity(ctx)
    if (!identity) throw new Error('Unauthorized')
    
    return ctx.db
      .query('ascents')
      .filter(q => q.eq(q.field('userId'), identity.subject))
      .collect()
  }
})
```

**Verification**:

- Manual: Sign in as User A, create ascent, sign in as User B → ascent not visible
- Convex dashboard: All ascents/training docs have `userId` populated

### 1.5 Add Backend Auth Tests

- Write E2E tests verifying:
  - Unsigned users can't call functions
  - Users only see their own data
  - Attempts to query other users' data fail

**Files**:

- `tests/auth-isolation.test.ts` *(new)* – Auth & isolation tests

**Verification**: `bun run test:e2e` passes; auth isolation tests green

---

## Phase 2: Authentication Providers (3–4 days, parallel with Phase 1)

Can start after Convex-Clerk integration; doesn't block later phases.

### 2.1 Configure Clerk Providers

- Enable Email + Password in Clerk dashboard settings
- Create OAuth apps for Google and GitHub (requires API keys from each provider)
- Add provider secrets to `.env` and Vercel environment variables

**Files**:

- `.env` – Add Clerk provider keys
- Convex dashboard / Vercel – Set production secrets

**Providers to support**:

- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Email + Password (with reset flow)

### 2.2 Test Auth Provider Flows

- Sign-in via Google, GitHub, Email+Password
- Sign-up via each provider
- Password reset flow (email)
- Verify user data persists and isolates correctly

**Files**:

- `tests/auth-providers.test.ts` *(new)* – Provider flow tests

**Verification**:

- `bun run test:e2e` passes for all auth flows
- Manual testing: Each provider works smoothly

---

## Phase 3: Data Import (Week 1, parallel with Phase 2)

Depends on Phase 1 (needs `userId` in schema).

### 3.1 Design Import Schema

- Document 8a.nu export format (columns, data types, edge cases)
- Document 27crags export format
- Map to app schema (ascents/training fields)

**Files**:

- `src/scripts/import-formats.md` *(new)* – Format documentation

### 3.2 Build Import Tools

- Create script to parse 8a.nu CSV/JSON exports
- Create script to parse 27crags CSV/JSON exports
- Handle edge cases: missing fields, duplicate records, date format variations

**Files**:

- `src/scripts/import-from-8anu.ts` *(new)* – 8a.nu importer
- `src/scripts/import-from-27crags.ts` *(new)* – 27crags importer
- Add CLI commands to `package.json`

### 3.3 Create Import UI

- Add import page: `/app/import` with file upload
- Validate file format, show preview of data to import
- Handle errors gracefully, show import progress/results
- Ensure imported data is user-isolated (tied to current user's `userId`)

**Files**:

- `src/app/import/page.tsx` *(new)* – Import page
- `src/app/import/components/FileUpload.tsx` *(new)* – Upload component
- `src/app/import/components/ImportPreview.tsx` *(new)* – Preview component
- `convex/import.ts` *(new)* – Import mutation

### 3.4 Test End-to-End

- Import sample 8a.nu export; verify 5+ ascents appear correctly
- Import sample 27crags export
- Verify data isolation: imports from User A don't affect User B

**Verification**:

- Sample imports load without errors
- Data is correctly attributed to importing user
- No data leaks between users

---

## Phase 4: Landing Page & Beta Messaging (3–4 days, parallel with Phase 2–3)

### 4.1 Create Public Landing Page

- Design page explaining app value: "Log, analyze, visualize climbing progress"
- Include feature overview, sign-up CTA, comparison to competitors (8a.nu, 27crags)
- Mobile-responsive, clear messaging

**Files**:

- `src/app/(landing)/page.tsx` *(new)* – Public landing page
- `src/app/(landing)/layout.tsx` *(new)* – Layout for public pages (no nav)

### 4.2 Add Beta Phase Indicator

- Add "Beta" badge/banner visible on main app
- Display disclaimer: "This app is in beta and provided as-is"
- Link to privacy/terms pages

**Files**:

- `src/app/_components/BetaBanner.tsx` *(new)* – Beta banner component
- `src/app/layout.tsx` – Include banner in app layout

### 4.3 Add Privacy & Terms Pages

- Create placeholder privacy policy (cover: data storage, export rights, deletion)
- Create placeholder terms of service
- Link from landing page and footer

**Files**:

- `src/app/privacy/page.tsx` *(new)* – Privacy policy
- `src/app/terms/page.tsx` *(new)* – Terms of service

**Verification**:

- Landing page loads, explains value clearly
- Beta disclaimer visible on main app
- Privacy/terms pages accessible from footer

---

## Phase 5: Security Hardening (3–4 days, parallel with Phase 4)

### 5.1 Add Rate Limiting

- Implement Convex action-level rate limits
- Limit mutations: 10/min per user
- Limit queries: 100/min per user
- Prevent brute-force attacks on auth endpoints

**Files**:

- `convex/rateLimit.ts` *(new)* – Rate limit utilities
- Update mutation/query handlers to use rate limiter

### 5.2 Validate All Inputs

- Audit all Convex functions for Zod schema validation
- Ensure sanitization where needed (e.g., user-generated text fields)
- Add validation for file uploads (size limits, format checks)

**Files**:

- `convex/ascents.ts` – Verify all mutations use validators
- `convex/training.ts` – Verify all mutations use validators
- `src/app/api/import/route.ts` *(new)* – File upload validation

### 5.3 Add Error Logging & Monitoring

- Integrate Sentry or equivalent for error tracking
- Log authentication failures, data access violations
- Set up alerts for suspicious activity (e.g., repeated 401s, rate limit hits)

**Files**:

- `src/lib/sentry.ts` *(new)* – Sentry initialization
- `src/app/error.tsx` – Update error handler to log to Sentry
- `next.config.ts` – Sentry integration for Next.js

### 5.4 Security Audit

Review for OWASP Top 10 compliance:

- ✅ Broken Authentication – Fixed in Phase 1
- ✅ Broken Access Control – Fixed in Phase 1
- ✅ SQL Injection – Safe (Convex query language)
- ✅ XSS – React escapes by default; verify no dangerouslySetInnerHTML
- ⚠️ Cross-Site Request Forgery (CSRF) – Review forms, ensure SameSite cookies
- ✅ Insecure Deserialization – Not applicable (no serialization)
- ⚠️ Insufficient Logging & Monitoring – Addressed in 5.3
- Check: Sensitive data exposure, using components with known vulnerabilities

**Files**:

- Run `bun run lint && bun run check` for linting/type safety
- Manual code review on security-critical paths

**Verification**:

- `bun run lint` passes
- Sentry integration working (test error logged)
- Rate limiting prevents abuse (manual test)

---

## Phase 6: Testing & Quality (Week 1, parallel with Phase 5)

### 6.1 Expand E2E Test Coverage

- Complete user workflows: sign-up → import → view dashboard → create ascent
- Multi-user isolation: User A and User B data don't mix
- Edge cases: duplicate imports, malformed CSV, oversized files, concurrent mutations

**Files**:

- Expand `tests/smoke.test.ts` or create `tests/workflows.test.ts` *(new)*
- `tests/multi-user.test.ts` *(new)* – Data isolation tests
- `tests/import-edge-cases.test.ts` *(new)* – Import error handling

### 6.2 Performance Testing

- Test dashboard load time with ~1k ascents per user
- Verify no N+1 queries
- Check Convex dashboard metrics (read/write latency)
- Stress test: concurrent imports, rapid mutations

**Verification**:

- Page load time <3s with 1k+ ascents
- Convex dashboard shows healthy query latency

### 6.3 Accessibility Review

- Ensure forms, buttons, navigation keyboard-accessible
- Run axe DevTools or similar; fix WCAG 2.1 AA violations
- Test with screen reader (e.g., VoiceOver on macOS)

**Verification**:

- Accessibility audit: 0 AA violations
- Keyboard navigation works throughout app

**Files**:

- Any component updates for a11y fixes

---

## Phase 7: Data Export (First month of beta – Week 1)

### 7.1 Implement Export Endpoint

- Create API endpoint: `GET /api/export` → ZIP file
- Include: `ascents.csv`, `training.csv`, `metadata.json`
- Ensure exported data is user-scoped (only current user's data)

**Files**:

- `src/app/api/export/route.ts` *(new)* – Export endpoint

### 7.2 Add Export UI

- Create user settings page: `/app/settings`
- Button: "Download my data"
- Shows file format, data size, last export date
- Handle download in browser

**Files**:

- `src/app/settings/page.tsx` *(new)* – Settings page
- `src/app/settings/components/ExportSection.tsx` *(new)* – Export controls

**Verification**:

- Export ZIP contains valid CSV files
- Exported data matches user's actual records
- No data from other users in export

---

## Phase 8: Observability & Polish (1–2 weeks, ongoing)

### 8.1 Convex Performance Monitoring

- Set up Convex dashboard alerts for:
  - Query latency spikes (>1s)
  - Action errors (>1% failure rate)
  - Read/write contention issues
- Track metrics over time (daily active users, data growth)

**Verification**: Metrics dashboard populated, alerts configured

### 8.2 UI/UX Improvements

- Mobile responsiveness: Test on iOS/Android browsers
- Dark mode: Optional (nice-to-have)
- Loading states, error messages, success feedback
- Responsive typography and spacing

**Files**:

- Component updates for styling/UX
- `src/app/index.module.css` – Update as needed

### 8.3 Documentation

- Write setup guide for beta testers
- Data import instructions (step-by-step for 8a.nu and 27crags)
- FAQ, troubleshooting guide
- Privacy policy details (data retention, deletion process)

**Files**:

- `BETA_TESTER_GUIDE.md` *(new)*
- `IMPORT_GUIDE.md` *(new)*
- Update `README.md` with beta info

### 8.4 Onboarding Flow

- Smooth signup → import data → first ascent creation
- Welcome email with getting started tips
- Onboarding tour or tooltips (optional)

**Verification**: Beta testers report smooth onboarding

---

## Release Checklist

- [ ] Phase 1: Auth, data isolation, backend tests passing
- [ ] Phase 2: All SSO providers (Google, GitHub, Email+Password) working
- [ ] Phase 3: Data import for 8a.nu and 27crags functional
- [ ] Phase 4: Landing page and beta messaging in place
- [ ] Phase 5: Security hardening complete, no known vulnerabilities
- [ ] Phase 6: E2E tests passing, <3s page load time, no a11y violations
- [ ] Phase 7: Data export working (ship within first week of beta)
- [ ] Phase 8: Monitoring and observability set up
- [ ] Privacy policy finalized (legal review recommended)
- [ ] Terms of service finalized (legal review recommended)
- [ ] Vercel deployment tested in staging and production

---

## Post-Beta Roadmap (v1.0 & Beyond)

These are out of scope for v1 beta but worth planning:

- Advanced analytics: Performance trends, grade progression, climbing style analysis
- Social features: Share ascents, follow other climbers, challenges
- Mobile app: iOS/Android native app
- Integrations: Strava, MyFitnessPal, calendar apps
- Real-time features: Live session tracking, notifications
- AI coaching: Personalized training recommendations

---

## Key Decisions

- **Closed beta**: Controlled group of testers; can iterate quickly
- **All 3 SSO providers required**: Google, GitHub, Email+Password (no exceptions)
- **Data import is critical**: Users won't switch without climbing history
- **Zero-downtime migration**: Widen-migrate-narrow pattern for existing data
- **Quality over speed**: Flexible timeline means thorough testing before launch
- **Vercel deployment**: Already configured, leverage existing setup

---

## Success Criteria

✅ **Beta Launch Ready When**:

1. All backend functions have auth guards and pass isolation tests
2. Users can sign up via all 3 providers without issues
3. Data import from 8a.nu and 27crags works without data loss or leaks
4. Landing page explains value; beta disclaimer visible throughout app
5. No OWASP Top 10 vulnerabilities; rate limiting prevents abuse
6. E2E tests cover core workflows and edge cases; page load <3s
7. Privacy policy and terms finalized (legal review done)
8. Data export working and tested
9. Monitoring and error logging configured
10. Closed beta group (5–10 testers) ready to validate

✅ **Successful Beta When**:

- Zero security incidents or data leaks
- Testers report smooth onboarding and data import
- No critical bugs blocking core workflows
- Feedback informs priorities for v1.0
