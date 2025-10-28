import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod/v3'

export const env = createEnv({
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ENV: z.string(),
    NEXT_PUBLIC_CONVEX_URL: z.string().url(),
  },
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_SHEET_ID_ASCENTS_BACKUP: process.env.GOOGLE_SHEET_ID_ASCENTS_BACKUP,
    GOOGLE_SHEET_ID_TRAINING_BACKUP:
      process.env.GOOGLE_SHEET_ID_TRAINING_BACKUP,
    // Client-side env
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    // Server-side env
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    GOOGLE_PRIVATE_KEY: z.string(),
    GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string(),
    GOOGLE_SHEET_ID_ASCENTS_BACKUP: z.string(),
    GOOGLE_SHEET_ID_TRAINING_BACKUP: z.string(),
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
