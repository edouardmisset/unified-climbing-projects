import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import { type Timeframe, timeframeSchema } from '~/schema/generic'

export const useTimeframeQueryState = (): UseTimeFrameStateOutput => {
  const [timeframe, setTimeframe] = useQueryState<Timeframe>('timeframe', {
    defaultValue: 'year',
    parse: value => {
      const result = timeframeSchema.safeParse(value)
      return result.success ? result.data : 'year'
    },
  })

  const handleTimeframeChange = useCallback(
    (value: Timeframe) => setTimeframe(value),
    [setTimeframe],
  )

  return { timeframe, handleTimeframeChange }
}

type UseTimeFrameStateOutput = {
  timeframe: Timeframe
  handleTimeframeChange: (value: Timeframe) => void
}
