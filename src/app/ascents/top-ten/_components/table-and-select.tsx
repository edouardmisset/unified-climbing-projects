'use client'

import { useQueryState } from 'nuqs'
import { Suspense, useDeferredValue } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import { TopTenTable } from '~/app/_components/top-ten-table/top-ten-table'
import type { Ascent } from '~/schema/ascent'
import { type Timeframe, timeframeSchema } from '~/schema/generic'
import { TimeframeSelect } from './timeframe-select'

export function TableAndSelect({
  initialTopTen: topTen,
}: {
  initialTopTen: Ascent[]
}) {
  const [timeframe, setTimeframe] = useQueryState<Timeframe>('timeframe', {
    defaultValue: 'year',
    parse: value => timeframeSchema.parse(value),
  })

  const deferredTimeframe = useDeferredValue(timeframe)

  const handleChange = (value: Timeframe) => {
    setTimeframe(value)
  }

  return (
    <div className="flex flex-column gap grid-full-width padding">
      <TimeframeSelect onChange={handleChange} value={timeframe} />
      <Suspense fallback={<Loader />}>
        <TopTenTable initialTopTen={topTen} timeframe={deferredTimeframe} />
      </Suspense>
    </div>
  )
}
