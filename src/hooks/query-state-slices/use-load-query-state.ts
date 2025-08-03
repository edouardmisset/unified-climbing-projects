import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { type LoadCategory, loadCategorySchema } from '~/schema/training'

export const useLoadQueryState = (): UseQueryStateReturn<
  OrAll<LoadCategory>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<LoadCategory>>('load', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : loadCategorySchema.parse(value),
  })
