# Testing strategy

The test suite protects critical behavior at three layers. Prefer the lowest layer that exercises
the real contract: unit tests for pure transformations, integration tests for framework and runtime
boundaries, and a deliberately small E2E smoke suite.

## Commands

| Suite             | Command                                                     | Purpose                                                          |
| ----------------- | ----------------------------------------------------------- | ---------------------------------------------------------------- |
| Unit tests        | `vp run test`                                               | Pure domain, helper, and transformation behavior                 |
| Integration tests | `vp run test:integration`                                   | Convex, React, browser component, and visual regression behavior |
| Update visuals    | `vp run test:integration --run -u`                          | Regenerate expected screenshots for intentional UI changes       |
| Read-only E2E     | `vp run test:e2e -- smoke.spec.ts view-transitions.spec.ts` | Public navigation and authenticated route availability           |
| Everything        | `vp run test:all`                                           | Unit, integration, and E2E suites                                |

## Fixtures and isolation

- Convex integration tests use `convex-test`, fake Clerk subjects, and an in-memory database. They do
  not contact a deployment.
- Component and visual tests use the committed canonical fixtures in `tests/fixtures/` through
  `src/testing/sample-data.ts`. Keep dates fixed and data synthetic or naturally anonymous.
- Service tests mock only authentication and Convex transport boundaries; they exercise the real
  batching and error-handling orchestration.
- E2E smoke tests are read-only. Do not add create, import, undo, or delete operations to this suite.

## Visual baseline workflow

Visual tests run in a dedicated headless Chromium project at 1280×720 with a fixed light theme,
disabled motion, and a 0.5% anti-aliasing tolerance. Platform-specific expected images under
`__screenshots__/` are committed, including the reviewed Linux/Chromium set used by CI; actual and
diff artifacts are ignored. Failed CI visual runs upload regenerated Linux baselines for review.

For an intentional visual change:

1. Run `vp run test:integration --run -u`.
2. Inspect every changed PNG, not only the test result.
3. Run `vp run test:integration` to verify the new baseline.
4. Commit test code and reviewed baselines together in an isolated commit.

## Coverage gates

Coverage remains broad, but gates prioritize critical workflows rather than thin page wrappers:

- global: 70% statements, 65% functions, and 65% branches;
- Convex imports: 90% statements, 85% functions, and 80% branches;
- server import orchestration: 95% statements, 90% functions, and 85% branches;
- settings import/export workflow: 85% statements, 80% functions, and 75% branches.

When adding production behavior, add a regression test at the appropriate layer before lowering or
excluding a threshold.

## CI environment

CI runs coverage, integration, and read-only E2E as separate checks. The E2E job requires a
dedicated non-production Clerk user and Convex deployment configured through:

- repository secrets: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CONVEX_URL`,
  `CLERK_SECRET_KEY`, `E2E_CLERK_USER_EMAIL`.

The workflow supplies `NEXT_PUBLIC_ENV=test`. CI runs coverage/unit, integration, and E2E
smoke sequentially so each layer starts only after the previous layer passes.

CI fails immediately when any required E2E value is absent. Local authenticated tests skip with an
explicit message when the dedicated test-user credentials are not configured.
