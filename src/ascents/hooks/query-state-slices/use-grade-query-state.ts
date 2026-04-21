import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/shared/components/dashboard/constants'
import type { OrAll } from '~/shared/components/dashboard/types'
import { type Ascent, gradeSchema } from '~/ascents/schema'

export const useGradeQueryState = (): UseQueryStateReturn<
  OrAll<Ascent['topoGrade']>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<Ascent['topoGrade']>>('grade', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : gradeSchema.parse(value)),
  })
