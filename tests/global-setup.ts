import nextEnv from '@next/env'
import { clerkSetup } from '@clerk/testing/playwright'

// Loads `.env*` the same way `next dev`/`next build` do, since Playwright's
// global setup runs as a standalone Node script outside the Next.js runtime.
export default async function globalSetup(): Promise<void> {
  nextEnv.loadEnvConfig(globalThis.process.cwd())
  await clerkSetup()
}
