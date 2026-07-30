# Plan: Merge Log Ascent & Log Training into one wizard page (GH #11)

## Outcome

Replace the two independent forms with `/log`, a three-step wizard that writes canonical v1
records through one authenticated Convex transaction.

1. **Common** — calendar date, shared location, and default canonical discipline.
2. **Training** — optional training details. A user can finish with training only or continue.
3. **Ascents** — one or more repeatable ascent cards, each able to override the default discipline.

The supported submissions are training only, ascents only, and training plus ascents. The old form
routes redirect to `/log`, and navigation exposes one `📋 Log` item.

## Current contracts

The wizard uses `src/domain/canonical/ascent.ts` and
`src/domain/canonical/training-session.ts` directly:

- Dates remain calendar dates in `YYYY-MM-DD` form.
- Ascent fields use `discipline`, `name`, and `grade`.
- Training fields use `discipline`, `location`, and required `type`.
- Canonical enum values are presented directly; legacy abbreviations are not accepted.
- `load` is not stored. Consumers derive it from intensity and volume when both exist.
- Ownership, fingerprints, and import metadata never enter form state.

The legacy schemas under `src/schema/` and the migration compatibility transformers are not form
boundaries for this feature.

## Implementation

1. Define a composite wizard schema in `src/app/log/schema.ts`. It validates the three supported
   submission shapes and converts HTML values through the canonical form schemas.
2. Add `convex/log.ts`. Its `post` mutation authenticates once, creates canonical fingerprints, and
   inserts the optional training session and all ascents atomically. It does not change the Convex
   table schema.
3. Expose the mutation through `src/services/log.ts` and validate again in the `/log` server action.
4. Build one React Hook Form wizard with `useFieldArray` for repeatable ascents. Keep step navigation
   editable and preserve data when moving backward. Persist the versioned, incomplete draft in
   user-scoped `localStorage`, while nuqs owns the current `step` search parameter.
5. Load the latest ascent, ascent locations and areas, and training locations concurrently in the
   route wrapper.
6. Replace the two navigation entries with `/log`; retain `/ascent-form` and
   `/training-session-form` as redirects for existing bookmarks.
7. Test canonical form composition, authenticated and owner-scoped atomic writes, navigation, and
   the three wizard outcomes. A Reset action removes the stored draft and restores the initial form
   defaults.

## Acceptance criteria

- An unauthenticated combined mutation is rejected before a write.
- An empty log is rejected.
- Training-only, ascent-only, and combined logs succeed.
- Multiple ascents are inserted in the same transaction and retain per-ascent disciplines.
- Every inserted record receives the acting Clerk subject and a canonical content fingerprint.
- A failed mutation leaves no partial training or ascent records.
- No new form code imports legacy schemas, stores `load`, or sends server-controlled fields.
- `/log` is the only logging destination exposed in navigation; old URLs redirect.
- Drafts survive reloads for seven days, remain isolated by Clerk user ID, and clear after Reset or
  successful submission.
- Unit tests, repository checks, end-to-end tests, and the production build pass.
