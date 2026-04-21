'use client'

import { Suspense, useDeferredValue, useMemo } from 'react'
import { AscentList } from '~/ascents/components/ascent-list/ascent-list'
import { Loader } from '~/shared/components/ui/loader/loader'
import NotFound from '~/app/not-found'
import { getTopTenAscents } from '~/ascents/helpers/get-top-ten-ascents'
import { useTimeframeQueryState } from '~/shared/hooks/query-state-slices/use-timeframe-query-state'
import type { AscentListProps } from '~/ascents/schema'
import { TimeframeSelect } from './timeframe-select'

export function TableAndSelect({ ascents }: AscentListProps) {
  const [timeframe] = useTimeframeQueryState()
  const deferredTimeframe = useDeferredValue(timeframe)

  const topTenAscents = useMemo(
    () =>
      getTopTenAscents({
        ascents: ascents ?? [],
        timeframe: deferredTimeframe,
      }),
    [ascents, deferredTimeframe],
  )

  if (ascents.length === 0) return <NotFound />

  return (
    <div className='flex flexColumn gap gridFullWidth padding'>
      <TimeframeSelect />
      <Suspense fallback={<Loader />}>
        <AscentList ascents={topTenAscents} showDetails={false} showPoints />
      </Suspense>
    </div>
  )
}
