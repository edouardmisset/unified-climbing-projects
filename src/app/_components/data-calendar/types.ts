import type { ReactNode } from 'react'
import type { StringDate } from '~/types/generic'

/**
 * Represents a calendar entry for a specific day
 */
export interface CalendarEntry {
  /** ISO date string for the day */
  date: string
  /** Background color for the calendar cell */
  backgroundColor?: string
  /** Detailed description shown in popovers */
  description: ReactNode
  /** Title shown on hover */
  title: ReactNode
  /** Short text displayed in the cell */
  shortText: ReactNode
  /** Whether this entry represents a special case */
  isSpecialCase?: boolean
}

/**
 * Configuration for data transformation
 */
export interface DataTransformConfig<T extends StringDate> {
  /** Function to extract background color from data */
  getBackgroundColor?: (data: T[]) => string
  /** Function to extract short text from data */
  getShortText?: (data: T[]) => ReactNode
  /** Function to extract title from data */
  getTitle?: (data: T[]) => ReactNode
  /** Function to extract description from data */
  getDescription?: (data: T[]) => ReactNode
  /** Function to determine if this is a special case */
  getIsSpecialCase?: (data: T[]) => boolean
}

/**
 * Simplified props for DataCalendar component
 */
export interface DataCalendarProps<T extends StringDate> {
  /** Year to display */
  year: number
  /** Array of data items with date strings */
  data: T[]
  /** Configuration for transforming data to calendar entries */
  config?: DataTransformConfig<T>
  /** Custom transformation function (advanced use case) */
  customTransform?: (year: number, data: T[]) => CalendarEntry[]
}

/**
 * Grouped data by year and day
 */
export interface GroupedData<T extends StringDate> {
  [year: number]: T[][]
}