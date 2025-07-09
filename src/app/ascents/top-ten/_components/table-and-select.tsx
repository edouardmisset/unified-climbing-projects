'use client'

import { useQueryState } from 'nuqs'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import { TopTenTable } from '~/app/_components/top-ten-table/top-ten-table'
import type { Ascent } from '~/schema/ascent'
import { type Timeframe, timeframeSchema } from '~/schema/generic'
import { TimeframeSelect } from './timeframe-select'

export function TableAndSelect({
  initialTopTen: topTen,
}: {
  initialTopTen: Ascent[]
}): React.JSX.Element {
  const [timeframe, setTimeframe] = useQueryState<Timeframe>('timeframe', {
    defaultValue: 'year',
    parse: value => timeframeSchema.parse(value),
  })

  const handleChange = (value: Timeframe) => {
    setTimeframe(value)
  }

  return (
    <div className="flex flex-column gap grid-full-width">
      <TimeframeSelect onChange={handleChange} value={timeframe} />
      <Suspense fallback={<Loader />}>
        <TopTenTable initialTopTen={topTen} timeframe={timeframe} />
      </Suspense>
    </div>
  )
}
