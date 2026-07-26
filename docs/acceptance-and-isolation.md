# Owner-isolation contract

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
