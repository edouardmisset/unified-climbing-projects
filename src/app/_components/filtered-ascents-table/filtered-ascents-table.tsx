'use client'

import NotFound from '~/app/not-found'
import { useAscentsFilter } from '~/hooks/use-ascents-filter'
import type { Ascent } from '~/schema/ascent'
import { AscentTable } from '../ascent-table/ascent-table'
import AscentsFilterBar from '../ascents-filter-bar/ascents-filter-bar'

export function FilteredAscentTable({ ascents }: { ascents: Ascent[] }) {
  const filteredAscents = useAscentsFilter(ascents ?? [])

  if (!ascents) return <NotFound />

  return (
    <>
      <AscentsFilterBar allAscents={ascents} />
      <AscentTable ascents={filteredAscents} />
    </>
  )
}
