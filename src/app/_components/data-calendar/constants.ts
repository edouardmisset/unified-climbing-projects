/**
 * Constants for the DataCalendar component
 */

export const EMPTY_CALENDAR_MESSAGES = {
  NO_RECORD: 'No record',
  YEAR_NOT_FOUND: 'Year not found',
} as const

export const CALENDAR_CELL_TYPES = {
  EMPTY: 'empty',
  NORMAL: 'normal',
  SPECIAL: 'special',
} as const