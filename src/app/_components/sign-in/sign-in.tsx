'use client'

import dynamic from 'next/dynamic'

// Clerk's <SignIn> mounts its own DOM node client-side, which never matches
// the server-rendered output, so it must be excluded from SSR entirely.
export const SignIn = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignIn), {
  ssr: false,
})
