import nextEnv from '@next/env'
import { clerkSetup } from '@clerk/testing/playwright'

// Loads `.env*` the same way `next dev`/`next build` do, since Playwright's
// global setup runs as a standalone Node script outside the Next.js runtime.
export default async function globalSetup(): Promise<void> {
  nextEnv.loadEnvConfig(globalThis.process.cwd())
  const requiredEnvironment = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_CONVEX_URL',
    'E2E_CLERK_USER_EMAIL',
    'E2E_CLERK_USER_PASSWORD',
  ] as const
  const missingEnvironment = requiredEnvironment.filter(name => !globalThis.process.env[name])
  if (globalThis.process.env.CI !== undefined && missingEnvironment.length > 0)
    throw new Error(`Missing required E2E environment: ${missingEnvironment.join(', ')}`)

  if (missingEnvironment.includes('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')) return
  if (missingEnvironment.includes('CLERK_SECRET_KEY')) return
  await clerkSetup()
}
