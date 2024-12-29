import { datesEqual, isDateInFirstWeek } from './helpers'

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
  backgroundColor: string | undefined
  foreColor: string | undefined
  shortText?: string
}) {
  const date = new Date(stringDate)
  const isToday = datesEqual(new Date(stringDate), new Date())

  if (date.getMonth() === 0 && isDateInFirstWeek(date)) {
    return (
      <i
        title={tooltip}
        className={styles.yearGridCell}
        style={{
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
