import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader.tsx'
import Layout from '../_components/page-layout/page-layout.tsx'
import { UnauthorizedAccess } from '../_components/unauthorized-access/unauthorized-access.tsx'
import { AscentFormWrapper } from './ascent-form-wrapper'

export default async function AscentFormPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SignedIn>
        <Layout gridClassName='padding' title='Congrats 🎉'>
          <span aria-describedby='form-description' className='visuallyHidden'>
            Form to log a climbing ascent
          </span>
          <Suspense fallback={<Loader />}>
            <AscentFormWrapper />
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
  description: 'Log an outdoor climbing ascent (boulder, route, or multi-pitch)',
  keywords: ['climbing', 'route', 'boulder', 'outdoor', 'multi-pitch', 'log'],
  title: 'Log ascent 📋',
}
