import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { LOCATION_TYPES, type LocationType } from '~/app/_components/filter-bar/types'

function isLocationType(value: string): value is LocationType {
  return LOCATION_TYPES.includes(value)
}

function isValidLocationTypeOrAll(value: string): value is OrAll<LocationType> {
  return value === ALL_VALUE || isLocationType(value)
}

export const useLocationTypeQueryState = (): UseQueryStateReturn<
  OrAll<LocationType>,
  OrAll<LocationType>
> =>
  useQueryState<OrAll<LocationType>>('locationType', {
    defaultValue: ALL_VALUE,
    parse: value => (isValidLocationTypeOrAll(value) ? value : ALL_VALUE),
  })
