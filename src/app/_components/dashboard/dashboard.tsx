'use client'

import { lazy, Suspense } from 'react'
import AscentsFilterBar from '~/app/_components/filter-bar/_components/ascents-filter-bar.tsx'
import NotFound from '~/app/not-found.tsx'
import { useAscentsFilter } from '~/hooks/use-ascents-filter.ts'
import type { AscentListProps } from '~/schema/ascent.ts'
import { DashboardStatistics } from './dashboard-statistics'
import { Loader } from '../loader/loader.tsx'

const AscentList = lazy(() =>
  import('../ascent-list/ascent-list').then(module => ({ default: module.AscentList })),
)

export function Dashboard({ ascents }: AscentListProps) {
  const filteredAscents = useAscentsFilter(ascents ?? [])

  if (ascents.length === 0) return <NotFound />

  return (
    <div className='flex flexColumn alignCenter gridFullWidth'>
      <AscentsFilterBar allAscents={ascents} showSearch={false} />
      <Suspense fallback={<Loader />}>
        <DashboardStatistics ascents={filteredAscents} />
      </Suspense>
      <section className='w100 padding'>
        <Suspense fallback={<Loader />}>
          <AscentList ascents={filteredAscents} />
        </Suspense>
      </section>
    </div>
  )
}
