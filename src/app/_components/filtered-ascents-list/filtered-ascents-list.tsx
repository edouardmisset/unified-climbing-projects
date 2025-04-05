'use client'

import NotFound from '~/app/not-found'
import { useAscentsFilter } from '~/hooks/use-ascents-filter'
import type { Ascent } from '~/schema/ascent'
import { AscentList } from '../ascent-list/ascent-list'
import AscentsFilterBar from '../ascents-filter-bar/ascents-filter-bar'

export function FilteredAscentList({ ascents }: { ascents: Ascent[] }) {
  const filteredAscents = useAscentsFilter(ascents ?? [])

  if (!ascents) return <NotFound />

  return (
    <section className="flex flex-column gap grid-full-width">
      <AscentsFilterBar allAscents={ascents} />
      <AscentList ascents={filteredAscents} />
    </section>
  )
}
