import type { Temporal } from '@js-temporal/polyfill'
import { DaysColumn } from './days-column'
import { WeeksRow } from './weeks-row'
import { YearGridCell } from './year-grid-cell'
import styles from './year-grid.module.css'

type DayDescriptor = {
  date: Temporal.PlainDateTime
  backgroundColor: string
  foreColor: string
  tooltip: string
  shortText?: string
}

export function YearGrid({
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
