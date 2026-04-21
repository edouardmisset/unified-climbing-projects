import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/shared/components/dashboard/constants'
import type { OrAll } from '~/shared/components/dashboard/types'
import { type Ascent, ascentStyleSchema } from '~/ascents/schema'

export const useStyleQueryState = (): UseQueryStateReturn<
  OrAll<Ascent['style']>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<Ascent['style']>>('style', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : ascentStyleSchema.parse(value)),
  })
