import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import Layout from '../_components/page-layout/page-layout'
import { UnauthorizedAccess } from '../_components/unauthorized-access/unauthorized-access'
import { LogFormWrapper } from './log-form-wrapper'

export default function LogPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SignedIn>
        <Layout gridClassName='padding' title='Log'>
          <span aria-describedby='form-description' className='visuallyHidden'>
            Wizard to log a training session, one or more climbing ascents, or both
          </span>
          <Suspense fallback={<Loader />}>
            <LogFormWrapper />
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
  description: 'Log a training session, climbing ascents, or both',
  keywords: ['climbing', 'training', 'ascent', 'log'],
  title: 'Log climbing 📋',
}
