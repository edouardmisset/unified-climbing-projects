import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { ascentSchema } from '~/schema/ascent'

export const useAreaQueryState = (): UseQueryStateReturn<OrAll<string>, typeof ALL_VALUE> =>
  useQueryState<OrAll<string>>('area', {
    defaultValue: ALL_VALUE,
    parse: value => {
      if (value === ALL_VALUE) return ALL_VALUE
      if (value.trim() === '') return null

      const result = ascentSchema.unwrap().required({ area: true }).shape.area.safeParse(value)
      return result.success ? result.data : null
    },
  })
