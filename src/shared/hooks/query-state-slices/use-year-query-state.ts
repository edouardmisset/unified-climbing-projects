import { isValidNumber } from '@edouardmisset/math'
import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/shared/components/dashboard/constants'
import type { OrAll } from '~/shared/components/dashboard/types'

export const useYearQueryState = (): UseQueryStateReturn<OrAll<string>, typeof ALL_VALUE> =>
  useQueryState<OrAll<string>>('year', {
    defaultValue: ALL_VALUE,
    parse: value => {
      if (value === ALL_VALUE) return ALL_VALUE
      if (isValidNumber(Number(value))) return value
      // oxlint-disable-next-line unicorn/no-null
      return null
    },
  })
