'use client'

import dynamic from 'next/dynamic'

// Clerk's <SignUp> mounts its own DOM node client-side, which never matches
// the server-rendered output, so it must be excluded from SSR entirely.
export const SignUp = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignUp), {
  ssr: false,
})
