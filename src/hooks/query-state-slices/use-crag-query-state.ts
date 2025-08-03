import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { type Ascent, ascentSchema } from '~/schema/ascent'

export const useCragQueryState = (): UseQueryStateReturn<
  OrAll<Ascent['crag']>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<Ascent['crag']>>('crag', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : ascentSchema.shape.crag.parse(value),
  })
