import type { ChangeEventHandler } from 'react'

export type FilterConfig = {
  name: string
  title: string
  options: string[] | number[] | readonly string[]
  selectedValue: string
  handleChange: ChangeEventHandler<HTMLSelectElement>
}

export type BaseFilterBarProps = {
  filters: FilterConfig[]
}
