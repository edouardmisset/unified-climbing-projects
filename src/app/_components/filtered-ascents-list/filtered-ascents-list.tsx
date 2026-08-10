'use client'

import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import NotFound from '~/app/not-found'
import { useAscentsFilterModel } from '~/hooks/use-ascents-filter'
import type { AscentListProps } from '~/schema/ascent'
import { AscentList } from '../ascent-list/ascent-list'
import AscentsFilterBar from '../filter-bar/_components/ascents-filter-bar'

export function FilteredAscentList({ ascents }: AscentListProps) {
  const filterModel = useAscentsFilterModel(ascents)

  if (ascents.length === 0) return <NotFound />

  return (
    <section className='flex flexColumn gridFullWidth padding overflowXClip'>
      <AscentsFilterBar facets={filterModel.facets} showSearch />
      <Suspense fallback={<Loader />}>
        <AscentList ascents={filterModel.ascents} />
      </Suspense>
    </section>
  )
}
