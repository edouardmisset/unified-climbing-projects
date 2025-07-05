'use client';
import { useQueryState } from 'nuqs'
import { Loader } from '~/app/_components/loader/loader'
import { TopTenTable } from '~/app/_components/top-ten-table/top-ten-table'
import { type Timeframe, timeframeSchema } from '~/schema/generic'
import { useTRPC } from '~/trpc/react'
import { TimeframeSelect } from './timeframe-select'

import { useQuery } from "@tanstack/react-query";

export function TableAndSelect(): React.JSX.Element {
  const api = useTRPC();
  const [timeframe, setTimeframe] = useQueryState<Timeframe>('timeframe', {
    defaultValue: 'year',
    parse: value => timeframeSchema.parse(value),
  })

  const { data: topTen, isLoading } = useQuery(api.ascents.getTopTen.queryOptions({
    timeframe,
  }))

  const handleChange = (value: Timeframe) => {
    setTimeframe(value)
  }

  if (isLoading) return <Loader />

  if (topTen === undefined || topTen.length === 0)
    return <div>No data available</div>

  return (
    <div className="flex flex-column gap grid-full-width">
      <TimeframeSelect onChange={handleChange} value={timeframe} />
      <TopTenTable topTenAscents={topTen} />
    </div>
  )
}
