import type { ChangeEventHandler } from 'react'

export const LOCATION_TYPES = ['Indoor', 'Outdoor'] as const
export type LocationType = (typeof LOCATION_TYPES)[number]

export type FilterConfig<T extends string | number = string> = {
  name: string
  title: string
  options: ReadonlyArray<T>
  selectedValue: T
  handleChange: ChangeEventHandler<HTMLSelectElement>
}

export type BaseFilterBarProps<T extends string | number = string> = {
  filters: FilterConfig<T>[]
  search?: string
  setSearch?: (value: string) => void
  showSearch: boolean
}
