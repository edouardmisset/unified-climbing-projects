'use client'

import NotFound from '~/app/not-found'
import { useAscentsFilter } from '~/hooks/use-ascents-filter'
import { api } from '~/trpc/react'
import { AscentTable } from '../ascent-table/ascent-table'
import AscentsFilterBar from '../ascents-filter-bar/ascents-filter-bar'
import { Loader } from '../loader/loader'

export function FilteredAscentTable() {
  const [allAscents, { isLoading }] =
    api.ascents.getAllAscents.useSuspenseQuery()

  const filteredAscents = useAscentsFilter(allAscents)

  if (isLoading) return <Loader />
  if (!allAscents) return <NotFound />

  return (
    <>
      <AscentsFilterBar allAscents={allAscents} />
      <AscentTable ascents={filteredAscents} />
    </>
  )
}
