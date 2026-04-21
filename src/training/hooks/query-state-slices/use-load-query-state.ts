import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/shared/components/dashboard/constants'
import type { OrAll } from '~/shared/components/dashboard/types'
import { type LoadCategory, loadCategorySchema } from '~/training/schema'

export const useLoadQueryState = (): UseQueryStateReturn<OrAll<LoadCategory>, typeof ALL_VALUE> =>
  useQueryState<OrAll<LoadCategory>>('load', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : loadCategorySchema.parse(value)),
  })
