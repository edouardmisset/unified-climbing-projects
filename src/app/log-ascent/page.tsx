import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader.tsx'
import { SignInButton } from '~/app/_components/sign-in-button/sign-in-button.tsx'
import { api } from '~/trpc/server.ts'
import GridLayout from '../_components/grid-layout/grid-layout.tsx'
import AscentForm from './_components/ascent-form.tsx'

async function fetchAscentData() {
  const [latestAscent, [minGrade = '7a', maxGrade = '8a'], allCrags, allAreas] =
    await Promise.all([
      api.ascents.getLatest(),
      api.grades.getMinMax(),
      api.crags.getAll({ sortOrder: 'newest' }),
      api.areas.getAll({ sortOrder: 'newest' }),
    ])
  return { latestAscent, minGrade, maxGrade, allCrags, allAreas }
}

export default async function Log() {
  const { latestAscent, minGrade, maxGrade, allCrags, allAreas } =
    await fetchAscentData()

  return (
    <Suspense fallback={<Loader />}>
      <SignedIn>
        <GridLayout gridClassName="padding" title="Congrats 🎉">
          <span aria-describedby="form-description" className="visually-hidden">
            Form to log a climbing ascent
          </span>
          <Suspense fallback={<Loader />}>
            <AscentForm
              areas={allAreas}
              crags={allCrags}
              latestAscent={latestAscent}
              maxGrade={maxGrade}
              minGrade={minGrade}
            />
          </Suspense>
        </GridLayout>
      </SignedIn>
      <SignedOut>
        <section className="flex-column gap">
          <h2>Unauthorized</h2>
          <p>You need to be signed in to log an ascent.</p>
          <SignInButton />
        </section>
      </SignedOut>
    </Suspense>
  )
}

export const metadata: Metadata = {
  description:
    'Log an outdoor climbing ascent (boulder, route, or multi-pitch)',
  keywords: ['climbing', 'route', 'boulder', 'outdoor', 'multi-pitch', 'log'],
  title: 'Log ascent 📋',
}
