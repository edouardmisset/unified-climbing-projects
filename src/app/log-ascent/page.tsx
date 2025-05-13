import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader.tsx'
import { SignInButton } from '~/app/_components/sign-in-button/sign-in-button.tsx'
import GridLayout from '../_components/grid-layout/grid-layout.tsx'
import AscentForm from './_components/ascent-form.tsx'

export default async function Log() {
  return (
    <Suspense fallback={<Loader />}>
      <SignedIn>
        <GridLayout title="Congrats 🎉" gridClassName="padding">
          <span className="visually-hidden" aria-describedby="form-description">
            Form to log a climbing ascent
          </span>
          <Suspense fallback={<Loader />}>
            <AscentForm />
          </Suspense>
        </GridLayout>
      </SignedIn>
      <SignedOut>
        <section className="flex-column gap">
          <p>You need to be signed in to log an ascent.</p>
          <SignInButton />
        </section>
      </SignedOut>
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: 'Log ascent 📋',
  description:
    'Log an outdoor climbing ascent (boulder, route, or multi-pitch)',
  keywords: ['climbing', 'route', 'boulder', 'outdoor', 'multi-pitch', 'log'],
}
