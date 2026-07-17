# Roadmap to v1 Beta

**Source:** [issue #94](https://github.com/edouardmisset/unified-climbing-projects/issues/94)  
**Historical input:** [PR #37](https://github.com/edouardmisset/unified-climbing-projects/pull/37), which must not be merged  
**Release:** restricted beta for at most 10 invited users

## Goal

Invited users can:

- sign in with Google, GitHub, or email and password;
- create, view, analyze, and visualize only their own data;
- import ascents from 8a.nu or canonical CSV;
- import training sessions from canonical CSV;
- export both datasets in a re-importable ZIP;
- request manual account deletion by email.

The release also needs a public landing page, factual beta/privacy terms, owner isolation, and a tested backup/restore procedure.

## Scope

- Clerk is the account source of truth. Convex stores its stable subject as `ownerId`; there is no app users table.
- Production data access closes before work starts and reopens only after the release smoke test.
- One in-place migration canonicalizes data, adds ownership, and generates fingerprints while preserving Convex IDs.
- Dates are calendar dates (`YYYY-MM-DD`), not timestamps.
- `/` becomes the landing page; the existing app home remains `/wrap-up`.
- Imports are parsed in the browser and written to Convex in simple atomic batches.
- Exports are generated in the browser; there is no export route or custom rate limiter.
- v1 has no record editing/deletion, import resumption/cancellation, account merging, self-service account deletion, 27 Crags support, automated backups, or Sentry.

## Canonical data contract

Convex supplies `_id` and `_creationTime`. They are never client inputs or user-defined fields.

Keep separate validators for stored documents, public inputs, public outputs, forms, import rows, and export rows. `ownerId`, `contentFingerprint`, and `importJobId` are server-controlled and excluded from public inputs and CSV files.

### Ascents

| Kind     | Fields                                                                      |
| -------- | --------------------------------------------------------------------------- |
| Required | `discipline`, `name`, `grade`, `crag`, `date`, `style`, `tries`             |
| Optional | `area`, `comments`, `height`, `holds`, `personalGrade`, `profile`, `rating` |
| Server   | `ownerId`, `contentFingerprint`, optional `importJobId`                     |

Migration rules:

- `climbingDiscipline` → `discipline`: `Route` → `Sport`, `Boulder` → `Bouldering`, preserve `Multi-Pitch`.
- `routeName` → `name`.
- `topoGrade` → `grade`.
- Convert legacy timestamps to their `Europe/Paris` calendar date.
- Preserve the other canonical values.
- Convert only `comments === "DWS"` to `Deep Water Soloing`.
- Remove `climber`, `region`, and `points`. Derive points when needed.

### Training sessions

| Kind     | Fields                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------- |
| Required | `date`, `type`                                                                                  |
| Optional | `discipline`, `location`, `anatomicalRegion`, `energySystem`, `comments`, `intensity`, `volume` |
| Server   | `ownerId`, `contentFingerprint`, optional `importJobId`                                         |

Migration rules:

- `climbingDiscipline` → `discipline` using the ascent mapping.
- `gymCrag` → `location`.
- `sessionType` → `type`.
- Convert legacy timestamps to their `Europe/Paris` calendar date.
- Expand legacy codes to the following values:

| Code  | Value                | Code | Value                           |
| ----- | -------------------- | ---- | ------------------------------- |
| `Out` | `Outdoor`            | `CS` | `Contact Strength`              |
| `Po`  | `Power`              | `MS` | `Max Strength`                  |
| `En`  | `Endurance`          | `PE` | `Power Endurance`               |
| `SE`  | `Strength Endurance` | `Ro` | `Routine`                       |
| `FB`  | `Finger Board`       | `Co` | `Core`                          |
| `Sg`  | `Stretching`         | `Sk` | `Skill`                         |
| `St`  | `Stamina`            | `Ta` | `Chill` (`Ch` when abbreviated) |
| `Ar`  | `Arms`               | `Fi` | `Fingers`                       |
| `Ge`  | `General`            | `AA` | `Anaerobic Alactic`             |
| `AL`  | `Anaerobic Lactic`   | `AE` | `Aerobic`                       |

`Ta` historically meant `Taper`; its reclassification to `Chill` is intentional.

Remove stored `load`. Derive `intensity * volume / 100` only when both inputs exist. The 228 audited sessions with volume and legacy load but no intensity keep no invented value.

### Fingerprints

Every ascent and training record stores `contentFingerprint`, indexed with `ownerId`.

Fingerprint only the canonical domain fields after validation, date/enum normalization, empty-value removal, and deterministic field ordering. Exclude IDs, ownership, import metadata, and source. Do not lowercase, strip accents, or fuzzy-match text.

The index is not unique: manual creation and “import anyway” may deliberately create identical records.

### Import jobs

`importJobs` stores owner, source, status, timestamps, and result counts. It does not store filenames, uploads, pending rows, cursors, or per-row provenance.

Imported records receive `importJobId` and are indexed by `(ownerId, importJobId)`. Undo deletes those records in bounded batches. Revision-aware undo is deferred with editing to v2.

### CSV and ZIP

- Ascent CSV requires the required ascent headers; training CSV requires `date` and `type`.
- Optional columns may be absent; columns may be in any order.
- Reject unknown or duplicate headers.
- Use UTF-8 and `YYYY-MM-DD`; empty optional cells mean absent values.
- Quote commas, quotes, newlines, Unicode, and empty values correctly.
- Export all canonical domain columns in a fixed order.
- Never export internal IDs, ownership, fingerprints, import IDs, points, or load.
- The ZIP contains exactly `ascents.csv` and `training-sessions.csv`.

Spreadsheet-formula neutralization is out of scope. Do not describe the CSV files as spreadsheet-safe; they are primarily for portability and re-import.

## Plan

### 0. Close production and secure the data

- [ ] Pause the production Convex deployment.
- [ ] Download a fresh backup, record its checksum and table counts outside Git, and rehearse restore in a temporary private Convex deployment. Delete the temporary deployment afterward.
- [ ] Remove real backups and raw fixtures from the working tree; retain only synthetic data and the minimal sanitized 8a.nu fixture.
- [ ] Add ignore rules and a small CI check blocking backup/export paths and archives.
- [ ] Close affected PRs, clean writable refs with `git-filter-repo`, force-push, check forks, and prevent old clones from reintroducing history.
- [ ] Ask GitHub Support to purge affected PR refs/caches; record confirmation or refusal.
- [ ] Record outside public Git the destination Clerk subject, sanitized 8a.nu fixture, and existing support/deletion email.

**Gate:** production is paused, restore works, cleanup is complete as far as GitHub permits, and all three inputs exist.

### 1. Implement authentication and the single migration

- [ ] Define the canonical validators, calendar-date helper, fingerprint helper, and pure legacy transformers.
- [ ] Test all mappings, `Ta` → `Chill`, three exact DWS matches, Europe/Paris dates, already-migrated rows, optional values, and non-derivable loads.
- [ ] Add Clerk authentication to Convex and one `requireIdentity(ctx)` helper.
- [ ] Build one idempotent internal migration with dry-run counts and errors.
- [ ] Rehearse it on a temporary private restore. Normal preview/E2E environments use synthetic data only.
- [ ] While Convex is paused, deploy a widened maintenance build: public reads require identity and expose no ownerless rows; public writes are disabled.
- [ ] Resume Convex and run the internal migration, assigning the selected owner and fingerprint to every record.
- [ ] Reconcile unchanged row counts and IDs, exactly three DWS conversions, zero ownerless rows, and zero missing fingerprints.
- [ ] Switch every consumer to canonical fields and owner-indexed queries. Lookups by ID must verify ownership.
- [ ] Stamp ownership and fingerprints server-side on inserts; never accept them from public arguments.
- [ ] Remove public action wrappers, shared user-data caches, legacy fields, and permissive validators.
- [ ] Test unauthenticated, user A, and user B list/detail/create access.

**Rollback:** pause Convex, redeploy the widened maintenance build, and restore the pre-migration backup. Do not write reverse transformers.

**Gate:** canonical migration, reconciliation, authentication, and isolation tests pass; beta access remains closed.

### 2. Add public routes and restricted sign-in

- [ ] Replace `/` with the landing page and keep the app at `/wrap-up`.
- [ ] Add marketing/app route groups without changing other stable URLs.
- [ ] Keep `/`, `/sign-in`, `/sign-up`, `/privacy`, and `/terms` public; protect all app, import, and settings routes through `src/proxy.ts`.
- [ ] Enable Clerk Restricted mode and invitations.
- [ ] Test Google, GitHub, and email/password sign-in, verification, recovery, redirects, cancelled OAuth, denied consent, and verified-email linking.
- [ ] Build no merge tool. Delete empty duplicate Clerk identities; freeze and resolve any duplicate containing data with a reviewed one-off migration.
- [ ] Publish the landing page, beta indicator, privacy page, beta terms, and existing support/deletion email.

**Gate:** public/protected routes and all three sign-in methods work, while Convex independently rejects unauthenticated access.

### 3. Build the shared CSV contract

- [ ] Publish ascent and training templates and document headers, values, dates, encoding, empty cells, and errors.
- [ ] Implement one shared canonical parser, serializer, normalizer, and fingerprint input format.
- [ ] Test export/import round trips for every field.

**Gate:** the shared contract is deterministic before import and export use it.

### 4. Add imports and undo

- [ ] Limit files to 5 MB and 10,000 rows. Tell users to split larger files; build no assisted path.
- [ ] Parse and preview files in the browser; never upload or log the original file.
- [ ] Implement the 8a.nu adapter from the sanitized fixture and publish current export instructions.
- [ ] Show invalid rows and existing exact fingerprint matches before confirmation.
- [ ] Revalidate and insert valid rows in atomic Convex batches under the authenticated owner.
- [ ] Create one job per attempt, stamp inserted records with its ID, skip duplicates by default, and offer “import anyway.”
- [ ] Stop at the first failed batch. Retry by selecting the file again; fingerprints skip earlier inserts.
- [ ] Allow completed or failed jobs with inserted rows to be undone in bounded batches.
- [ ] Test malformed files, limits, quoting, Unicode, duplicates, failed retry, undo, and two users.

**Gate:** all three import sources work, default re-import is idempotent, retry is safe, undo works, and owner isolation passes.

### 5. Add client-side export

- [ ] Add export under `/settings`.
- [ ] Fetch both owner-scoped datasets and generate the canonical CSV files and ZIP in the browser.
- [ ] Test empty data, optional fields, Unicode, quoting, realistic large data, ZIP integrity, two users, and export → import.

**Gate:** the ZIP contains only the signed-in user's two files and re-imports without duplicates by default.

### 6. Finish operations and security

- [ ] Remove the Vercel backup cron, Google Sheets code/dependencies/configuration, backup scripts, and platform-wide dump queries.
- [ ] Document a weekly manual Convex backup plus mandatory backups before migration, release, and restore. Promise no retention beyond the provider's current policy.
- [ ] Document destructive restore, code/environment recovery, reconciliation, and smoke testing.
- [ ] After restore, keep access closed, compare restored owners with Clerk, delete orphaned owners' data, then reopen.
- [ ] Document manual deletion: identify and disable the Clerk subject, delete its records/jobs in batches, verify zero live data, delete the Clerk user, and confirm by email.
- [ ] Rehearse restore and deletion with synthetic accounts.
- [ ] Audit completed Convex functions, server code, route handlers, caches, logs, secrets, ID lookups, input limits, and preview/production separation.

**Gate:** backup/restore and deletion work, old backup plumbing is gone, all completed surfaces were audited, and no known critical/high issue remains.

### 7. Release

- [ ] Run `vp run validate` and review migration/reconciliation evidence.
- [ ] Test invitation → sign-in → import → charts → create → export → undo → sign-out in preview.
- [ ] Repeat with two accounts and attempt every cross-account operation.
- [ ] Verify production OAuth, recovery, restricted sign-up, beta/legal copy, logs, and export contents.
- [ ] Open beta access only after the production smoke test passes.
- [ ] Invite at most 10 users.

## Order

```text
Close production
  → authenticate and migrate
  → add public routes and restricted sign-in
  → establish the shared CSV contract
  → build import and client export
  → rehearse operations and audit all completed surfaces
  → release to at most 10 users
```

## Required inputs

- Exact Clerk subject that owns existing records
- Minimal sanitized current 8a.nu fixture
- Existing support/deletion email address

None belongs in public Git if it contains personal data.

## Deferred to v2 or later

- Record editing/deletion, revisions, and revision-aware undo
- Persistent import resumption, cancellation, cursors, or per-row provenance
- Account merge/transfer tooling and self-service deletion
- 27 Crags import
- Larger cohorts and scaling work justified by measurements
- Automated/custom-retention backups and server-side export controls
- Application profiles, social features, sharing, Sentry, and unrelated redesigns
