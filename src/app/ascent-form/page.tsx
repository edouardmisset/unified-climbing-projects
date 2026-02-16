import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader.tsx'
import {
  getAllAreas,
  getAllCrags,
  getLatestAscent,
  getMinMaxGrades,
} from '~/services/ascent-helpers'
import Layout from '../_components/page-layout/page-layout.tsx'
import { UnauthorizedAccess } from '../_components/unauthorized-access/unauthorized-access.tsx'
import AscentForm from './_components/ascent-form.tsx'

export default async function AscentFormPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SignedIn>
        <Layout gridClassName="padding" title="Congrats 🎉">
          <span aria-describedby="form-description" className="visuallyHidden">
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

async function AscentFormWrapper() {
  const [latestAscent, [minGrade = '7a', maxGrade = '8a'], allCrags, allAreas] =
    await Promise.all([
      getLatestAscent(),
      getMinMaxGrades(),
      getAllCrags(),
      getAllAreas(),
    ])

  return (
    <AscentForm
      areas={allAreas}
      crags={allCrags}
      latestAscent={latestAscent}
      maxGrade={maxGrade}
      minGrade={minGrade}
    />
  )
}

export const metadata: Metadata = {
  description:
    'Log an outdoor climbing ascent (boulder, route, or multi-pitch)',
  keywords: ['climbing', 'route', 'boulder', 'outdoor', 'multi-pitch', 'log'],
  title: 'Log ascent 📋',
}
