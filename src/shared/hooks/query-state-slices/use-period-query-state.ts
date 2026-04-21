import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/shared/components/dashboard/constants'
import type { OrAll } from '~/shared/components/dashboard/types'
import { type Period, periodSchema } from '~/shared/schema'

export const usePeriodQueryState = (): UseQueryStateReturn<OrAll<Period>, typeof ALL_VALUE> =>
  useQueryState<OrAll<Period>>('period', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : periodSchema.parse(value)),
  })
