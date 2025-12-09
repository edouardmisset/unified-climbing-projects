import type { ReactNode } from 'react'
import type { StringDate } from '~/types/generic'

/**
 * Simplified props for DataCalendar component
 */
export interface DataCalendarProps<T extends StringDate> {
  /** Year to display */
  year: number
  /** Array of data items with date strings */
  data?: T[] | Promise<T[]>
  /** Function to render a day cell */
  renderDay: (data: T[], date: string) => ReactNode
}

/**
 * Grouped data by year and day
 */
export interface GroupedData<T extends StringDate> {
  [year: number]: T[][]
}
