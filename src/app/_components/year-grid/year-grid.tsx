import type { Temporal } from '@js-temporal/polyfill'
import { DaysColumn } from './days-column.tsx'
import { WeeksRow } from './weeks-row.tsx'
import { YearGridCell } from './year-grid-cell.tsx'
import styles from './year-grid.module.css'

type DayDescriptor = {
  date: Temporal.PlainDateTime
  backgroundColor: string
  foreColor: string
  tooltip: string
  shortText?: string
}

export async function YearGrid({
  dayCollection,
  year,
}: {
  year: number
  dayCollection: DayDescriptor[]
}) {
  return (
    <div className={styles.yearGrid}>
      {<DaysColumn year={year} />}
      {<WeeksRow />}
      {dayCollection.map(
        ({ date, tooltip, backgroundColor, foreColor, shortText = '' }) => {
          return (
            <YearGridCell
              key={date.toString()}
              date={date}
              tooltip={tooltip}
              backgroundColor={backgroundColor}
              foreColor={foreColor}
              shortText={shortText}
            />
          )
        },
      )}
    </div>
  )
}
