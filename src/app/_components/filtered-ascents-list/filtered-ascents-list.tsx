'use client'

import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import NotFound from '~/app/not-found'
import { useAscentsFilter } from '~/hooks/use-ascents-filter'
import type { AscentListProps } from '~/schema/ascent'
import { AscentList } from '../ascent-list/ascent-list'
import AscentsFilterBar from '../filter-bar/_components/ascents-filter-bar'

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
