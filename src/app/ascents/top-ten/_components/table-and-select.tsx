'use client'

import { useQueryState } from 'nuqs'
import { Suspense } from 'react'
import { AscentList } from '~/app/_components/ascent-list/ascent-list'
import { Loader } from '~/app/_components/loader/loader'
import { getTopTenAscents } from '~/helpers/get-top-ten-ascents'
import type { AscentListProps } from '~/schema/ascent'
import { type Timeframe, timeframeSchema } from '~/schema/generic'
import { TimeframeSelect } from './timeframe-select'

export function TableAndSelect({ ascents }: AscentListProps) {
  const [timeframe] = useQueryState<Timeframe>('timeframe', {
    defaultValue: 'year',
    parse: value => timeframeSchema.parse(value),
  })

  const topTenAscents = getTopTenAscents({
    ascents,
    timeframe,
  })
  return (
    <div className="flex flex-column gap grid-full-width padding">
      <TimeframeSelect />
      <Suspense fallback={<Loader />}>
        <AscentList
          ascents={topTenAscents}
          showDetails={false}
          showPoints={true}
        />
      </Suspense>
    </div>
  )
}
