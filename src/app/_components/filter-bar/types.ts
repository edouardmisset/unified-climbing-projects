export const LOCATION_TYPES = ['Indoor', 'Outdoor'] as const
export type LocationType = (typeof LOCATION_TYPES)[number]

export type FilterConfig = {
  name: string
  title: string
  options: readonly string[]
  selectedValue: string
  setValue: (value: string) => void
}

export type BaseFilterBarProps = {
  filters: FilterConfig[]
  search?: string
  setSearch?: (value: string) => void
  showSearch: boolean
}
