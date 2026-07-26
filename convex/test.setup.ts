/// <reference types="vite/client" />

// Glob of every Convex function module, required by `convex-test` so it can
// resolve `internalMutation`/`internalAction` references the mock backend
// needs to execute (see https://docs.convex.dev/testing/convex-test).
export const modules = import.meta.glob('./**/*.ts')
