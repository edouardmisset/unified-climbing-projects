import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader.tsx'
import { api } from '~/trpc/server.ts'
import Layout from '../_components/page-layout/page-layout.tsx'
import { UnauthorizedAccess } from '../_components/unauthorized-access/unauthorized-access.tsx'
import TrainingSessionForm from './_components/training-session-form.tsx'

export default async function TrainingSessionFormPage() {
  const allLocations = await api.training.getAllLocations()

  return (
    <Suspense fallback={<Loader />}>
      <SignedIn>
        <Layout gridClassName="padding" title="Train Hard 💪">
          <span aria-describedby="form-description" className="visuallyHidden">
            Form to log a training session
          </span>
          <Suspense fallback={<Loader />}>
            <TrainingSessionForm allLocations={allLocations} />
          </Suspense>
        </Layout>
      </SignedIn>
      <SignedOut>
        <UnauthorizedAccess />
      </SignedOut>
    </Suspense>
  )
}

export const metadata: Metadata = {
  description: 'Log a training session',
  keywords: ['climbing', 'training', 'session', 'log'],
  title: 'Log Training Session 📋',
}
