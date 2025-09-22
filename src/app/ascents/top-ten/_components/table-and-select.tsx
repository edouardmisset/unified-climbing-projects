'use client'

import { Suspense, useDeferredValue, useMemo } from 'react'
import { AscentList } from '~/app/_components/ascent-list/ascent-list'
import { Loader } from '~/app/_components/loader/loader'
import { getTopTenAscents } from '~/helpers/get-top-ten-ascents'
import { useTimeframeQueryState } from '~/hooks/query-state-slices/use-timeframe-query-state'
import type { AscentListProps } from '~/schema/ascent'
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

  if (!ascents) return <Loader />

  return (
    <div className="flex flexColumn gap gridFullWidth padding">
      <TimeframeSelect />
      <Suspense fallback={<Loader />}>
        <AscentList ascents={topTenAscents} showDetails={false} showPoints />
      </Suspense>
    </div>
  )
}
