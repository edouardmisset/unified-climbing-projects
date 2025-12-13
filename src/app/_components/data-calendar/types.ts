import type { CSSProperties, ReactNode } from 'react'
import type { StringDate } from '~/types/generic'

export interface CalendarCellRender {
  date: string
  content?: ReactNode
  popoverTitle?: ReactNode
  popoverDescription?: ReactNode
  style?: CSSProperties
  isSpecialCase?: boolean
  isEmpty?: boolean
  className?: string
}

export type DayTransform<T extends StringDate> = (params: {
  items: T[]
  date: string
  dayIndex: number
  maxCount: number
}) => CalendarCellRender

export interface DataCalendarProps<T extends StringDate> {
  year: number
  data?: T[] | Promise<T[]>
  transformDay?: DayTransform<T>
}

export interface GroupedData<T extends StringDate> {
  [year: number]: T[][]
}
