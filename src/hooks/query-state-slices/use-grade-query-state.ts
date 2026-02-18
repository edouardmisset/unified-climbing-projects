import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { type Ascent, gradeSchema } from '~/schema/ascent'

export const useGradeQueryState = (): UseQueryStateReturn<
  OrAll<Ascent['topoGrade']>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<Ascent['topoGrade']>>('grade', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : gradeSchema.parse(value)),
  })
