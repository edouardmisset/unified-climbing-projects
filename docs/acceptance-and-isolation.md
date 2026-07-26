# Synthetic acceptance and owner-isolation contract

Pre-migration browser acceptance runs against a deterministic local dataset. It does not query or
write Convex, configure Clerk, or rely on a live backup.

## Offline acceptance

Run:

```sh
vp run test:e2e:offline
```

The command builds with `CLIMBING_DATA_SOURCE=synthetic`, starts the resulting Next.js build
locally, and runs Playwright against loopback only. The Playwright fixture aborts every non-loopback
browser request, so Clerk, analytics, and other remote browser services cannot be contacted by this
suite.

The deterministic fixture lives in `src/data/synthetic-acceptance-fixture.ts`. It contains two
ascents and two training sessions across 2023 and 2024, including optional fields and Unicode. The
browser suite verifies:

- all existing read-oriented pages render on desktop Chromium and Mobile Safari;
- both canonical ascent records appear in the ascent list;
- both canonical training types and the synthetic location appear in the training list;
- lookup of the known synthetic ascent succeeds;
- lookup of an unknown synthetic ID returns “Ascent not found”;
- desktop skip-link keyboard behavior remains intact.

Synthetic writes remain blocked at the service boundary and are covered by unit tests. Form
submission is not part of this suite because it would require authentication and a write-capable
backend.

## User A/user B isolation matrix

`src/testing/owner-isolation-matrix.ts` is the executable case inventory for the owner migration,
imports, undo, and exports. It uses only fake Clerk subjects and fake record IDs. Unit tests enforce
unique identifiers, symmetrical user A/user B cases, unauthenticated coverage, cross-owner hiding,
and complete operation categories.

The matrix covers:

| Phase           | Contract cases                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| Owner migration | unauthenticated rejection; scoped lists; own/cross-owner details; owner-stamped creates; scoped aggregates |
| Imports         | owner-scoped duplicate lookup; owner-stamped jobs; own/cross-owner job reads; owner-scoped undo            |
| Exports         | exactly the acting user's ascent and training datasets                                                     |

The matrix is also exercised manually against a temporary private Convex restore before production
cutover. The rehearsal must prove:

- unauthenticated queries fail;
- the migrated owner sees the expected records;
- a second synthetic identity initially sees no records;
- a synthetic import is visible only to that second identity;
- an exact repeat is skipped by default;
- undo removes the imported record; and
- bounded account deletion removes the synthetic identity's records and jobs without changing the
  migrated owner's reconciliation counts.

Store the dated command output with the private migration evidence, never in public Git.

## Full local gate

```sh
vp run validate:offline
```

This runs static checks, unit tests, the guarded offline browser suite, and the synthetic production
build without using remote application data.
