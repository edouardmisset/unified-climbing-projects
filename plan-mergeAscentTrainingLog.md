# Plan: Merge Log Ascent & Log Training into one wizard page (GH #11)

## TL;DR

Replace the two separate pages (`/ascent-form`, `/training-session-form`) with a single new route implementing a 3-step wizard:

- **Step 1** — common fields: date, location (merged crag/gymCrag), default climbingDiscipline
- **Step 2** — training details (skippable via "skip" button if user only wants to log an outdoor ascent)
- **Step 3** — ascent details, auto-shown when step 2's `sessionType === 'Out'` (or reached directly when step 2 is skipped); supports adding multiple ascents (repeatable "ascent card"), each can override the default discipline from step 1

Single "Finish" submits everything at once: training row created only if step 2 wasn't skipped; one `addAscent()` call per ascent card. UI-only merge — no changes to Convex schema/tables. Old routes removed (no redirects, single-user app). Nav collapses to one "📋 Log" entry.

## Steps

### Phase 1: Foundations

1. Design wizard client state (React state/reducer or context) holding: common fields, optional training slice, array of ascent entries (each with own discipline override).
2. Define per-step Zod schemas, reusing existing pieces:
   - `commonStepSchema` (date, location, climbingDiscipline)
   - `trainingStepSchema` = existing `trainingSessionFormSchema` minus date/discipline/location
   - `ascentStepSchema` = existing `ascentFormOutputSchema` minus date/crag/climbingDiscipline default (allow per-ascent override)

### Phase 2: UI (depends on Phase 1)

3. `StepCommon` — date, merged location field (decide UX: unify crag+gymCrag autocomplete suggestions or keep separate lists depending on indoor/outdoor context), climbingDiscipline select.
4. `StepTraining` — reuse fields from [training-session-form.tsx](src/app/training-session-form/_components/training-session-form.tsx) (sessionType, anatomicalRegion, energySystem, intensity, volume, comments) minus fields lifted to step 1. Add "Skip training details" action.
5. `StepAscent` — adapt fields from [ascent-form.tsx](src/app/ascent-form/_components/ascent-form.tsx) (routeName, area, tries, style via `ClimbingStyleToggleGroup`, topoGrade/personalGrade via `GradeInput`, holds, profile, height, rating, comments) into a repeatable "ascent card" with "Add another climb" button; per-card discipline override defaulting to step 1 value.

### Phase 3: Wizard shell (depends on Phase 2)

6. Build a `Wizard` container: step index state, back/next navigation (editing previous steps allowed), conditional auto-advance to step 3 when `sessionType === 'Out'`, entry directly to step 3 when training is skipped. Reuse `KeycapButton`, `Spacer`, `Loader` for visual consistency with [form.module.css](src/app/_components/forms/form.module.css).

### Phase 4: Submission (depends on Phase 3)

7. New server action(s) for the merged page: on Finish —
   - call `addTrainingSession()` (existing service, [convex/training.ts](convex/training.ts#L16) `post` mutation) only if step 2 wasn't skipped; keep existing load = volume × intensity calculation ([training-session-form/actions.ts#L14](src/app/training-session-form/actions.ts#L14))
   - call `addAscent()` (existing service, [convex/ascents.ts](convex/ascents.ts#L16) `post` mutation) once per ascent card
   - No Convex schema/mutation changes (per decision: UI-only merge)

### Phase 5: Routing & nav cleanup (depends on Phase 4)

8. Create new route (recommend `src/app/log/page.tsx`) with a wrapper combining data currently fetched separately by [ascent-form-wrapper.tsx](src/app/ascent-form/ascent-form-wrapper.tsx) and [training-form-wrapper.tsx](src/app/training-session-form/training-form-wrapper.tsx) (latest ascent, grades, crags, areas, gym/session locations).
9. Delete `src/app/ascent-form/` and `src/app/training-session-form/` directories entirely (no redirects — single-user app).
10. Update [navigation constants.ts](src/app/_components/navigation/constants.ts) — replace the two `📋 Log Ascent` / `📋 Log Training` links with one `📋 Log` entry pointing to the new route.

### Phase 6: Verification (depends on Phase 5)

11. Update Playwright smoke tests referencing old routes ([tests/smoke.test.ts](tests/smoke.test.ts), smoke test names under `test-results/`).
12. Manual test matrix: gym-only session (skip step 3), outdoor-only ascent (skip step 2, jump to step 3), full day (train + climb outdoor with 2+ ascents, mixed disciplines), back-navigation edits, per-ascent discipline override, "Out" sessionType auto-advancing to step 3.

## Relevant files

- `src/app/ascent-form/_components/ascent-form.tsx` — source of ascent fields/logic to port into `StepAscent`
- `src/app/training-session-form/_components/training-session-form.tsx` — source of training fields/logic to port into `StepTraining`, including the current "Out → redirect to /ascent-form" behavior ([L56-57](src/app/training-session-form/_components/training-session-form.tsx#L56)) which is replaced by the wizard auto-advance
- `src/app/ascent-form/actions.ts`, `src/app/training-session-form/actions.ts` — existing server actions/validation to merge into new submission logic
- `src/schema/ascent.ts`, `src/schema/training.ts` — existing Zod schemas to reuse/slice per step
- `src/app/_components/climbing-style-toggle-group/climbing-style-toggle-group.tsx` — toggle pattern reference (Base UI toggle-group)
- `src/app/_components/navigation/constants.ts` — nav links to collapse into one entry
- `convex/ascents.ts`, `convex/training.ts` — mutations called unchanged
- `tests/smoke.test.ts` — update route references

## Decisions (from Q&A)

- UI pattern: **3-step wizard** (not tabs/toggle), not simultaneous single form
- Step 1 (common): date + location (merged crag/gymCrag) + climbingDiscipline (used as **default**, overridable per ascent)
- Step 2 (training) is **skippable** — user can jump straight to logging an ascent
- Step 3 (ascent) auto-triggers when step 2's sessionType = 'Out', or is reached directly if step 2 skipped
- Step 3 supports **multiple ascents** per wizard run ("add another climb")
- Submission happens **once, at the end** (Finish button) — not per-step
- Back/next navigation allowed to edit prior steps
- If training is skipped, **no training row is created** — only ascent(s) submitted
- Per-ascent discipline can **override** the step-1 default
- Data model: **UI-only merge** — Convex schema and mutations (`ascents`, `training` tables) stay separate/unchanged
- Routing: **new single route**, old `/ascent-form` and `/training-session-form` **removed with no redirects** (single-user app, acceptable)
- Nav: collapse two links into **one "📋 Log" entry**

## Further Considerations

1. **Multi-Pitch discipline**: current ascent form restricts climbingDiscipline to Route/Boulder only ([ascent-form.tsx#L225](src/app/ascent-form/_components/ascent-form.tsx#L225)), though schema allows 'Multi-Pitch'. Recommend keeping that restriction in step 1 default and per-ascent override unless the user wants to expand scope to support Multi-Pitch (separate concern, not raised in original issue).
2. **Merged route path**: recommend `/log` (short, matches the collapsed nav label "📋 Log").
3. **Location autocomplete source**: should the merged "location" field's autocomplete suggestions combine crag history + gym/session location history into one list, or stay context-sensitive (crag suggestions when discipline suggests outdoor, gym suggestions otherwise)? Recommend combined single list for simplicity given it's now one field.
