import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { ascentDomainSchema } from '~/domain/ascent'

export const useAreaQueryState = (): UseQueryStateReturn<OrAll<string>, typeof ALL_VALUE> =>
  useQueryState<OrAll<string>>('area', {
    defaultValue: ALL_VALUE,
    // The parser must distinguish the all sentinel, blank input, and invalid areas.
    // fallow-ignore-next-line complexity
    parse: value => {
      if (value === ALL_VALUE) return ALL_VALUE
      if (value.trim() === '') return null

      const result = ascentDomainSchema.shape.area.safeParse(value)
      if (!result.success) return null
      return result.data ?? null
    },
  })
