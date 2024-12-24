import { nonCalendarColumnCount, nonCalendarRowCount } from './constants'
import {
  datesEqual,
  getWeek,
  isDateInFirstWeek,
  isFirstDayInFirstISOWeek,
} from './helpers'

import styles from './year-grid.module.css'

export async function YearGridCell({
  stringDate,
  tooltip,
  backgroundColor,
  foreColor,
  shortText,
}: {
  stringDate: string
  tooltip: string
  backgroundColor: string
  foreColor: string
  shortText?: string
}) {
  const date = new Date(stringDate)
  const isToday = datesEqual(new Date(stringDate), new Date())

  // 1 is Monday, ..., 6 is Saturday, 7 is Sunday
  const weekdayIndex = date.getDay()

  const isMondayInFirstWeek = isFirstDayInFirstISOWeek(date.getFullYear())

  const isSunday = weekdayIndex === 0
  const correctedWeekDay = isSunday ? 7 : weekdayIndex

  const gridRow = correctedWeekDay + nonCalendarRowCount

  if (date.getMonth() === 0 && isDateInFirstWeek(date)) {
    return (
      <i
        title={tooltip}
        className={styles.yearGridCell}
        style={{
          gridColumn: 1 + nonCalendarColumnCount,
          gridRow,
          backgroundColor,
          color: foreColor,
          outline: isToday ? '2px solid var(--color-light)' : 'none',
        }}
        tabIndex={0}
      >
        {shortText}
      </i>
    )
  }

  return (
    <i
      title={tooltip}
      className={styles.yearGridCell}
      style={{
        gridColumn:
          getWeek(date) +
          (isMondayInFirstWeek ? 0 : 1) +
          (isSunday ? -0 : 0) +
          nonCalendarColumnCount,
        gridRow,
        backgroundColor,
        color: foreColor,
        outline: isToday ? '2px solid var(--color-light)' : 'none',
      }}
      tabIndex={0}
    >
      {shortText}
    </i>
  )
}
