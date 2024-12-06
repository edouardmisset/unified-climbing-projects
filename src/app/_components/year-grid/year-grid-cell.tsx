import { Temporal } from '@js-temporal/polyfill'

import styles from './year-grid.module.css'

const today = Temporal.Now.plainDateTimeISO()

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
        outline: date.toPlainDate().equals(today.toPlainDate())
          ? '2px solid var(--color-light)'
          : 'none',
      }}
      tabIndex={0}
    >
      {shortText}
    </i>
  )
}
