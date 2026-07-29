import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { ascentDisciplineSchema } from '~/domain/canonical/ascent'
import type { Ascent } from '~/schema/ascent'

export const useDisciplineQueryState = (): UseQueryStateReturn<
  OrAll<Ascent['discipline']>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<Ascent['discipline']>>('discipline', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : ascentDisciplineSchema.parse(value)),
  })
