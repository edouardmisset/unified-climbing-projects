# Dependency updates

Dependency updates are proposed weekly by `.github/workflows/update-dependencies.yml`.
The updater stays within the versions declared in `package.json`, refreshes the lockfile, and
updates pnpm within major version 11. It does not update GitHub Actions or major dependencies.
New package releases must be at least seven days old before pnpm will resolve them.
Two exact legacy transitive versions are excluded from the no-downgrade trust check because
their dependency ranges currently have no compatible trusted replacement: `eslint-config-prettier@9.1.2`
and `semver@6.3.1`. These are version-specific exceptions, not package or scope-wide bypasses.

## GitHub App setup

Create a GitHub App installed only on this repository with:

- Contents: Read and write
- Pull requests: Read and write
- No workflow, issues, deployments, or administration permissions

Store these repository secrets:

- `DEPENDENCY_UPDATE_APP_ID`
- `DEPENDENCY_UPDATE_PRIVATE_KEY`

Set the repository variable `DEPENDENCY_UPDATE_BOT_LOGIN` to the exact bot login shown on a PR
created by the App. The automerge workflow requires that exact identity, the updater branch, and
the repository-local head before it will enable automerge.

## Review policy

The updater's pull request must pass the normal CI, dependency review, and audit checks. Only
production dependency patches and development dependency patches/minors may be auto-merged.
Production dependency minors/majors, development dependency majors, workspace policy, scripts,
package-manager changes, and workflow changes require human review.
Configure the `main` branch ruleset to require the `Format Lint Typecheck Tests` and `Review
dependency changes` checks; the audit gate runs inside the CI check. GitHub will not complete
the requested auto-merge until those required checks pass.

Every external GitHub Action is pinned to a full commit SHA. Run `pnpm run verify:github-actions`
when changing a workflow; release tags are kept only as comments next to their immutable pins.
