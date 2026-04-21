import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/shared/components/dashboard/constants'
import type { OrAll } from '~/shared/components/dashboard/types'
import { ascentSchema } from '~/ascents/schema'

export const useAreaQueryState = (): UseQueryStateReturn<OrAll<string>, typeof ALL_VALUE> =>
  useQueryState<OrAll<string>>('area', {
    defaultValue: ALL_VALUE,
    parse: value => {
      if (value === ALL_VALUE) return ALL_VALUE
      if (value.trim() === '') return null

      const result = ascentSchema.required({ area: true }).shape.area.safeParse(value)
      return result.success ? result.data : null
    },
  })
