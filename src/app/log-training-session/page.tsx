import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader.tsx'
import { SignInButton } from '~/app/_components/sign-in-button/sign-in-button.tsx'
import GridLayout from '../_components/grid-layout/grid-layout.tsx'
import TrainingSessionForm from './_components/training-session-form.tsx'

export default async function LogTrainingSession() {
  return (
    <Suspense fallback={<Loader />}>
      <SignedIn>
        <GridLayout gridClassName="padding" title="Train Hard 💪">
          <span aria-describedby="form-description" className="visually-hidden">
            Form to log a training session
          </span>
          <Suspense fallback={<Loader />}>
            <TrainingSessionForm />
          </Suspense>
        </GridLayout>
      </SignedIn>
      <SignedOut>
        <section className="flex-column gap">
          <p>You need to be signed in to log a training session.</p>
          <SignInButton />
        </section>
      </SignedOut>
    </Suspense>
  )
}

export const metadata: Metadata = {
  description: 'Log a training session',
  keywords: ['climbing', 'training', 'session', 'log'],
  title: 'Log Training Session 📋',
}
