import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { LOCATION_TYPES, type LocationType } from '~/app/_components/filter-bar/types'

export const useLocationTypeQueryState = (): UseQueryStateReturn<
  OrAll<LocationType>,
  OrAll<LocationType>
> =>
  useQueryState<OrAll<LocationType>>('locationType', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE || LOCATION_TYPES.includes(value as LocationType)
        ? (value as OrAll<LocationType>)
        : ALL_VALUE,
  })
