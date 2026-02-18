import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { TIMEFRAMES, type Timeframe, timeframeSchema } from '~/schema/generic'

const [, defaultTimeframe] = TIMEFRAMES

export const useTimeframeQueryState = (): UseQueryStateReturn<Timeframe, typeof defaultTimeframe> =>
  useQueryState<Timeframe>('timeframe', {
    defaultValue: defaultTimeframe,
    parse: value => {
      const parsedTimeframe = timeframeSchema.safeParse(value)
      return parsedTimeframe.success ? parsedTimeframe.data : defaultTimeframe
    },
  })
