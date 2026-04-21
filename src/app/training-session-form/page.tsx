import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/shared/components/ui/loader/loader.tsx'
import Layout from '~/shared/components/page-layout/page-layout.tsx'
import { UnauthorizedAccess } from '~/shared/components/unauthorized-access/unauthorized-access.tsx'
import { TrainingFormWrapper } from './training-form-wrapper'

export default async function TrainingSessionFormPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SignedIn>
        <Layout gridClassName='padding' title='Train Hard 💪'>
          <span aria-describedby='form-description' className='visuallyHidden'>
            Form to log a training session
          </span>
          <Suspense fallback={<Loader />}>
            <TrainingFormWrapper />
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
