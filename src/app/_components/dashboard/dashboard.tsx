'use client'

import { lazy, Suspense } from 'react'
import AscentsFilterBar from '~/app/_components/filter-bar/_components/ascents-filter-bar.tsx'
import NotFound from '~/app/not-found.tsx'
import { useAscentsFilterModel } from '~/hooks/use-ascents-filter.ts'
import type { AscentListProps } from '~/schema/ascent.ts'
import { DashboardStatistics } from './dashboard-statistics'
import { Loader } from '../ui/loader/loader.tsx'

const AscentList = lazy(async () =>
  import('../ascent-list/ascent-list').then(module => ({ default: module.AscentList })),
)

export function Dashboard({ ascents }: AscentListProps) {
  const filterModel = useAscentsFilterModel(ascents)

  if (ascents.length === 0) return <NotFound />

  return (
    <div className='flex flexColumn alignCenter gridFullWidth'>
      <AscentsFilterBar facets={filterModel.facets} showSearch={false} />
      <Suspense fallback={<Loader />}>
        <DashboardStatistics ascents={filterModel.ascents} />
      </Suspense>
      <section className='w100 padding'>
        <Suspense fallback={<Loader />}>
          <AscentList ascents={filterModel.ascents} />
        </Suspense>
      </section>
    </div>
  )
}
