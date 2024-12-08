import { Temporal } from '@js-temporal/polyfill'

import { parseISODateToTemporal } from '~/schema/ascent'
import styles from './year-grid.module.css'

const today = Temporal.Now.plainDateTimeISO()

export async function YearGridCell({
  date,
  tooltip,
  backgroundColor,
  foreColor,
  shortText,
}: {
  date: string
  tooltip: string
  backgroundColor: string
  foreColor: string
  shortText?: string
}) {
  const temporal = parseISODateToTemporal(date)
  return (
    <i
      title={tooltip}
      className={styles.yearGridCell}
      style={{
        gridColumn: temporal.weekOfYear + 1,
        gridRow: temporal.dayOfWeek + 1,
        backgroundColor,
        color: foreColor,
        outline: temporal.toPlainDate().equals(today.toPlainDate())
          ? '2px solid var(--color-light)'
          : 'none',
      }}
      tabIndex={0}
    >
      {shortText}
    </i>
  )
}
