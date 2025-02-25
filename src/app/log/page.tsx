import { SignInButton } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader.tsx'
import Form from './_components/form.tsx'

export default async function Log() {
  return (
    <>
      <SignedIn>
        <Suspense fallback={<Loader />}>
          <Form />
        </Suspense>
      </SignedIn>
      <SignedOut>
        <p>You need to be signed in to log an ascent.</p>
        <SignInButton />
      </SignedOut>
    </>
  )
}
