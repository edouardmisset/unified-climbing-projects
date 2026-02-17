import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { type Period, periodSchema } from '~/schema/generic'

export const usePeriodQueryState = (): UseQueryStateReturn<OrAll<Period>, typeof ALL_VALUE> =>
  useQueryState<OrAll<Period>>('period', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : periodSchema.parse(value)),
  })
