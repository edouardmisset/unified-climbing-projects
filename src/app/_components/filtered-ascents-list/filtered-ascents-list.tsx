'use client'

import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import NotFound from '~/app/not-found'
import { useAscentsFilter } from '~/hooks/use-ascents-filter'
import { type AscentListProps, ascentSchema } from '~/schema/ascent'
import { AscentList } from '../ascent-list/ascent-list'
import AscentsFilterBar from '../filter-bar/_components/ascents-filter-bar'

export function FilteredAscentList({ ascents }: AscentListProps) {
  const parsedAscents = ascents ? ascentSchema.array().parse(ascents) : []

  const filteredAscents = useAscentsFilter(parsedAscents)

  if (!ascents) return <Loader />

  if (ascents.length === 0) return <NotFound />

  return (
    <section className="flex flexColumn gridFullWidth overflowXClip">
      <AscentsFilterBar allAscents={parsedAscents} />
      <Suspense fallback={<Loader />}>
        <AscentList ascents={filteredAscents} />
      </Suspense>
    </section>
  )
}
