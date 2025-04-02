'use client'

import { useQueryState } from 'nuqs'
import { Loader } from '~/app/_components/loader/loader'
import { TopTenTable } from '~/app/_components/top-ten-table/top-ten-table'
import { type Timeframe, timeframeSchema } from '~/schema/generic'
import { api } from '~/trpc/react'
import { TimeframeSelect } from './timeframe-select'

export function TableAndSelect(): React.JSX.Element {
  const [timeframe, setTimeframe] = useQueryState<Timeframe>('timeframe', {
    defaultValue: 'year',
    parse: value => timeframeSchema.parse(value),
  })

  const { data: topTen, isLoading } = api.ascents.getTopTen.useQuery({
    timeframe,
  })

  const handleChange = (value: Timeframe) => {
    setTimeframe(value)
  }

  if (isLoading) return <Loader />

  if (topTen === undefined || topTen.length === 0)
    return <div>No data available</div>

  return (
    <>
      <TimeframeSelect value={timeframe} onChange={handleChange} />
      <TopTenTable topTenAscents={topTen} />
    </>
  )
}
