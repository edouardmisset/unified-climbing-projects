import type { Temporal } from '@js-temporal/polyfill'

import styles from './year-grid.module.css'

export async function YearGridCell({
  date,
  tooltip,
  backgroundColor,
  foreColor,
  shortText,
}: {
  date: Temporal.PlainDateTime
  tooltip: string
  backgroundColor: string
  foreColor: string
  shortText?: string
}) {
  return (
    <i
      title={tooltip}
      className={styles.yearGridCell}
      style={{
        gridColumn: date.weekOfYear + 1,
        gridRow: date.dayOfWeek + 1,
        backgroundColor,
        color: foreColor,
      }}
    >
      {shortText}
    </i>
  )
}
