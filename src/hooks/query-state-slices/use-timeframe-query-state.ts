import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { TIMEFRAMES, type Timeframe, timeframeSchema } from '~/schema/generic'

const defaultTimeframe = TIMEFRAMES[0]

export const useTimeframeQueryState = (): UseQueryStateReturn<Timeframe, (typeof TIMEFRAMES)[0]> =>
  useQueryState<Timeframe>('timeframe', {
    defaultValue: defaultTimeframe,
    parse: value => {
      const parsedTimeframe = timeframeSchema.safeParse(value)
      return parsedTimeframe.success ? parsedTimeframe.data : defaultTimeframe
    },
  })
