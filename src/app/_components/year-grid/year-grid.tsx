import type { Temporal } from '@js-temporal/polyfill'
import { DaysColumn } from './days-column'
import { WeeksRow } from './weeks-row'
import styles from './year-grid.module.css'
import { YearGridCell } from './year-grid-cell'

export function YearGrid({
  yearlyData: content,
  year,
}: {
  year: number
  yearlyData: {
    date: Temporal.PlainDate
    backgroundColor: string
    foreColor: string
    tooltip: string
    shortText?: string
  }[]
}) {
  return (
    <div className={styles.yearGrid}>
      {<DaysColumn year={year} />}
      {<WeeksRow />}
      {content.map(
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
