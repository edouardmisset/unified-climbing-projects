# Dependency updates

Renovate proposes dependency updates every Monday at 03:00 UTC. Install the hosted Renovate
GitHub App for this repository and commit the repository configuration in `renovate.json`.
Renovate uses its npm manager for `package.json`, `pnpm-workspace.yaml`, and `pnpm-lock.yaml`,
delegating lockfile updates to pnpm. Weekly lockfile maintenance keeps transitive dependencies
fresh, but lockfile-only PRs remain manual-review changes. It is limited to one open update PR at a time.

GitHub Actions are intentionally outside Renovate's enabled managers. Action versions remain a
human-reviewed change and are checked by `pnpm run verify:github-actions` in CI.

## Renovate setup

Install the hosted Renovate GitHub App only on this repository, then enable the repository in the
app. No updater-specific repository secrets or workflow token are required. If using a self-hosted
Renovate deployment instead, use a repository-scoped GitHub App installation token and preserve the
same repository configuration and permissions policy.

New package releases must be at least seven days old before Renovate proposes them. The pnpm
configuration enforces the same seven-day window again while resolving the lockfile, protecting
against newly introduced transitive packages.
Two exact legacy transitive versions are excluded from the no-downgrade trust check because
their dependency ranges currently have no compatible trusted replacement: `eslint-config-prettier@9.1.2`
and `semver@6.3.1`. These are version-specific exceptions, not package or scope-wide bypasses.

## Review policy

The updater's pull request must pass the normal CI, dependency review, and audit checks. Only
production dependency patches and development dependency patches/minors may be auto-merged.
Production dependency minors/majors, development dependency majors, workspace policy, scripts,
package-manager changes, and workflow changes require human review.
Configure the `main` branch ruleset to require the `Format Lint Typecheck Tests` and `Review
dependency changes` checks; the audit gate runs inside the CI check. Renovate will not complete an
auto-merge until those required checks pass.

Every external GitHub Action is pinned to a full commit SHA. Run `pnpm run verify:github-actions`
when changing a workflow; release tags are kept only as comments next to their immutable pins.
