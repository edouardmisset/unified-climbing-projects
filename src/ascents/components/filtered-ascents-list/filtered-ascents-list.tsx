'use client'

import { Suspense } from 'react'
import { Loader } from '~/shared/components/ui/loader/loader'
import NotFound from '~/app/not-found'
import { useAscentsFilter } from '~/ascents/hooks/use-ascents-filter'
import type { AscentListProps } from '~/ascents/schema'
import { AscentList } from '../ascent-list/ascent-list'
import AscentsFilterBar from '~/shared/components/filter-bar/_components/ascents-filter-bar'

export function FilteredAscentList({ ascents }: AscentListProps) {
  const filteredAscents = useAscentsFilter(ascents)

  if (ascents.length === 0) return <NotFound />

  return (
    <section className='flex flexColumn gridFullWidth padding overflowXClip'>
      <AscentsFilterBar allAscents={ascents} showSearch />
      <Suspense fallback={<Loader />}>
        <AscentList ascents={filteredAscents} />
      </Suspense>
    </section>
  )
}
