'use client'

import { Loader } from 'lucide-react'
import { Suspense } from 'react'
import NotFound from '~/app/not-found'
import { useAscentsFilter } from '~/hooks/use-ascents-filter'
import type { AscentListProps } from '~/schema/ascent'
import { AscentList } from '../ascent-list/ascent-list'
import AscentsFilterBar from '../ascents-filter-bar/ascents-filter-bar'

export function FilteredAscentList({ ascents }: AscentListProps) {
  const filteredAscents = useAscentsFilter(ascents ?? [])

  if (ascents.length === 0) return <NotFound />

  return (
    <section className="flex flex-column grid-full-width">
      <AscentsFilterBar allAscents={ascents} />
      <Suspense fallback={<Loader />}>
        <AscentList ascents={filteredAscents} />
      </Suspense>
    </section>
  )
}
