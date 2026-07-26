# Operations runbook

These procedures are for the restricted v1 beta. Keep deployment names, Clerk subjects, exports,
checksums, counts, and command output outside public Git.

## Safety rules

- Pause production or enable `MIGRATION_MAINTENANCE=true` before migration, restore, or deletion.
- Take a fresh Convex snapshot before migration, release, restore, and any destructive operation.
- Restore into a temporary private deployment first and reconcile it before touching production.
- Never put snapshots, exports, raw provider files, or personal identifiers in Git.
- Do not reopen access until authentication, owner isolation, counts, IDs, and a smoke test pass.
- Convex/provider retention is the only promised retention; this app makes no longer retention
  guarantee.

## Routine backup

Once per week, and at each mandatory checkpoint:

1. Export every production Convex table to an archive.
2. Record the UTC timestamp, production deployment name, SHA-256 checksum, and per-table counts in
   the private operations log.
3. Store the archive in the approved private location.
4. Restore that exact archive into a temporary private deployment.
5. Run `diagnostics:reconcile` with the expected Clerk subject and compare table counts.
6. Delete the temporary deployment after verification.

Example checksum:

```sh
shasum -a 256 path/to/snapshot.zip
```

## v1 migration cutover

1. Verify the destination Clerk subject in Clerk and the private migration record.
2. Take and restore-rehearse a fresh production snapshot.
3. Pause the Convex production deployment.
4. Set `CLERK_JWT_ISSUER_DOMAIN` and `MIGRATION_MAINTENANCE=true` in production Convex.
5. Deploy the widened schema and v1 Convex functions.
6. Resume Convex. Writes remain rejected by the maintenance flag.
7. Run `migrations:run` internally with `dryRun: true`; stop on any error or unexpected count.
8. Run it with `dryRun: false`, then run a second dry-run. The second run must report zero
   migrations.
9. Run `diagnostics:reconcile`. Verify unchanged row counts and IDs, zero ownerless/wrong-owner
   rows, zero missing fingerprints, and the expected exact DWS conversions.
10. Deploy and smoke-test the application while beta access remains restricted.
11. Set `MIGRATION_MAINTENANCE=false` only after the smoke test passes.

Rollback is forward-only at the schema/code level: pause Convex, deploy the widened maintenance
build, restore the pre-cutover snapshot, reconcile, and smoke-test. Do not run reverse transformers.

## Destructive restore

1. Close beta access, pause Convex, and take a snapshot of the current state.
2. Confirm the restore archive checksum and restore rehearsal evidence.
3. Restore the selected archive through Convex.
4. Redeploy the matching Git commit and restore its documented Clerk, Convex, and Vercel
   environment configuration.
5. Keep access closed. Run migration if the snapshot is legacy, then reconcile counts, IDs,
   ownership, and fingerprints.
6. Compare every restored owner with Clerk. Delete data for orphaned subjects using the deletion
   operation below.
7. Test unauthenticated rejection, two-user isolation, create, import/undo, charts, and export.
8. Reopen only after the evidence has been reviewed.

## Manual account deletion

Deletion requests arrive at the support address shown in the app.

1. Verify the requester and resolve the exact Clerk subject.
2. Disable that Clerk user so no new writes can race deletion.
3. Take the mandatory pre-deletion snapshot and record the request privately.
4. Run `operations:countOwnerData` for the subject and record the counts.
5. Run `operations:deleteOwnerData`. It deletes ascents, training sessions, and import jobs in
   bounded batches.
6. Run `operations:countOwnerData` again and require zero for all three tables.
7. Delete the Clerk user.
8. Confirm completion to the requester without including internal identifiers or retained
   operational evidence.

If any step fails, keep the Clerk user disabled and beta access closed for that identity until the
procedure can be completed and verified.

## Release smoke test

Use two invited test accounts and attempt both permitted and cross-account operations:

- public landing/privacy/terms and protected-route redirects;
- Google, GitHub, and email/password sign-in, recovery, cancellation, and denied consent;
- list/detail/create for ascents and training sessions;
- canonical CSV import, duplicate skip, import-anyway, failed retry, and undo;
- charts, calendars, wrap-up, and settings;
- ZIP contents (`ascents.csv` and `training-sessions.csv` only) and export-to-import round trip;
- sign-out and unauthenticated Convex rejection.

Review Convex, Clerk, Vercel, and application logs for identifiers, record contents, tokens, or raw
imports before inviting beta users.
