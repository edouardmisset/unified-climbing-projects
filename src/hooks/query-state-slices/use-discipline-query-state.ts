import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { type Ascent, climbingDisciplineSchema } from '~/schema/ascent'

export const useDisciplineQueryState = (): UseQueryStateReturn<
  OrAll<Ascent['climbingDiscipline']>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<Ascent['climbingDiscipline']>>('discipline', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : climbingDisciplineSchema.parse(value),
  })
