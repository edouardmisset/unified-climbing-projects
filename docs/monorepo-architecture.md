# pnpm monorepo migration for shared data and auth

## Summary

Convert the single-package workspace into a pnpm/Vite+ monorepo while preserving
the current Next.js behaviour. Keep one Clerk instance per environment and one
Convex deployment per environment as the authoritative auth and data systems;
future frontend apps consume those services through framework-neutral contracts.

Vite+ remains the task runner: its workspace-aware cached tasks support Next.js
and future Preact apps without adding Turborepo. See the
[Vite+ monorepo guide](https://viteplus.dev/guide/monorepo).

## Architecture and dependencies

- Create `apps/web-next` for the current App Router application; do not add a
  Preact app in this increment.
- Create these workspace packages:
  - `packages/domain`: climbing entities, Zod schemas, CSV/import-export
    contracts, fingerprints, dates, analytics transforms, and framework-free
    helpers.
  - `packages/backend-convex`: the sole Convex schema, functions, migrations,
    generated API/types, and Clerk issuer configuration.
  - `packages/data-access`: validated Convex query/mutation adapters accepting
    an injected auth-token provider; no Next.js or Clerk imports.
  - `packages/auth-contract`: shared `AuthTokenProvider` and identity
    interfaces only; each frontend owns its Clerk SDK adapter.
  - `packages/ui-foundations`: CSS custom-property tokens, global style
    foundations, and non-framework presentation constants. Keep current
    Next-specific composites, router/link/image integration, and Base UI
    components inside `web-next`.
- Use explicit `workspace:*` dependencies and unique package names so Vercel
  can calculate affected projects correctly. See
  [Vercel monorepos](https://vercel.com/docs/monorepos).
- Keep current resolved versions during the structural migration: pnpm
  `11.17.0`, Node `24.x`, Next `16.2.12`, React `19.2.8`, Clerk `6.39.6`,
  Convex `1.42.3`, Vite+ `0.2.4`, Vitest `4.1.10`, and TypeScript `6.0.3`.
  Retain app-scoped UI/form/chart dependencies; keep `convex-helpers` and
  `convex-test` backend-scoped.
- Remove the unused `NEXT_PUBLIC_API_BASE_URL` example variable after
  confirming no deployment configuration supplies it. Preserve all Clerk,
  Convex, E2E, and maintenance variables with package-specific `.env.example`
  documentation.

## Auth, data, and deployment

- Preserve existing owner-scoped Convex behaviour and the Clerk JWT template
  audience `convex`; Convex remains the authorization enforcement point. See
  [Convex + Clerk](https://docs.convex.dev/auth/clerk).
- Configure each environment with one Clerk application and one Convex
  project/deployment set: local developer deployment, shared staging, and
  production. Each deployment receives its matching
  `CLERK_JWT_ISSUER_DOMAIN`.
- Deploy each frontend as its own Vercel Project, rooted at its `apps/*`
  directory, with workspace-source inclusion enabled. Production apps use
  sibling subdomains and the same Clerk instance for ordinary shared session
  behaviour; reserve Clerk satellite domains only for future unrelated domains.
  See [Clerk domain guidance](https://clerk.com/docs/guides/dashboard/dns-domains/satellite-domains).
- Make `web-next` the designated Convex deployment owner: its Vercel production
  build runs the backend deploy followed by the Next build. Future frontend
  Vercel projects only build their own app, preventing duplicate backend
  deployments.
- Point all Vercel previews at the shared staging Convex URL. Preview builds
  must never deploy Convex; staging promotion is an explicit vetted workflow.
  This protects production data while accepting that concurrent
  backend-preview validation is intentionally deferred.
- Retain Vercel Analytics and Speed Insights in `web-next`; future apps opt in
  independently.

## Tooling and verification

- Expand `pnpm-workspace.yaml` to `apps/*`, `packages/*`, and shared tooling;
  replace root scripts with Vite+ recursive/filter commands for build, check,
  test, dev, and Convex workflows.
- Move or adapt TypeScript paths, Vite+ test projects, Playwright
  configuration, CI, spellcheck, style checks, and coverage globs to workspace
  paths.
- Verify:
  - Existing unit, DOM, browser, visual, Convex owner-isolation,
    import/export, and Playwright smoke suites pass from their workspace
    commands.
  - Root recursive checks/builds respect dependency order and cache behaviour.
  - Production and staging builds receive only their intended environment
    values.
  - Clerk sign-in plus a Convex read/write succeeds on `web-next`, and owner
    isolation remains unchanged.
  - A placeholder future app package can be added with `pnpm --filter` commands
    and a separate Vercel project without duplicating schema, auth
    configuration, or data-access logic.

## Assumptions

- No data migration or Clerk-instance replacement is required; this is a
  source-layout and deployment architecture migration.
- The first increment preserves only the current Next.js UI. A Preact SPA is a
  follow-up implementation using `@climbing/domain`,
  `@climbing/data-access`, `@climbing/auth-contract`, and
  `@climbing/ui-foundations`.
- Shared staging is deliberately used for Vercel previews; isolated per-PR
  Convex deployments remain a later upgrade path supported by Convex. See
  [Convex deployments](https://docs.convex.dev/production/multiple-deployments).
