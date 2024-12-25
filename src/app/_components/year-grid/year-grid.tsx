import { isDateInYear } from '~/helpers/is-date-in-year.ts'
import { DaysColumn } from './days-column.tsx'
import { getNumberOfDaysInYear } from './helpers.ts'
import { WeeksRow } from './weeks-row.tsx'
import { YearGridCell } from './year-grid-cell.tsx'
import styles from './year-grid.module.css'

type DayDescriptor = {
  date: string
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
  const displayedNumberOfWeeks = Math.ceil(
    (getNumberOfDaysInYear(year) + 1) / 7,
  )
  const firstDayOfYear = new Date(year, 0, 1, 12)
  const firstDayIndex = firstDayOfYear.getUTCDay()
  const prependWeek53 = firstDayIndex >= 4 || firstDayIndex === 0

  const numberOfColumns = 1 + displayedNumberOfWeeks + (prependWeek53 ? 1 : 0)

  const columns = [
    0,
    ...(prependWeek53 ? [53] : []),
    ...Array.from({ length: displayedNumberOfWeeks }, (_, index) => index + 1),
  ]

  const numberOfDaysFromLastMondayTo1stJanuary =
    firstDayIndex === 0 ? 6 : firstDayIndex - 1

  const emptyDays = Array.from(
    { length: numberOfDaysFromLastMondayTo1stJanuary },
    (_, index): DayDescriptor => ({
      date: '',
      tooltip: '',
      backgroundColor: '',
      foreColor: '',
      shortText: index.toString(),
    }),
  )

  return (
    <div
      className={styles.yearGrid}
      style={{
        gridTemplateColumns: `repeat(${numberOfColumns},1fr)`,
      }}
    >
      <DaysColumn />
      <WeeksRow columns={columns} />
      {[...emptyDays, ...dayCollection].map(
        ({ date, tooltip, backgroundColor, foreColor, shortText = '' }) =>
          date === '' ? (
            <i
              key={shortText}
              className={`${styles.yearGridCell} ${styles.emptyGridCell}`}
            />
          ) : (
            isDateInYear(date, year) && (
              <YearGridCell
                key={date.toString()}
                stringDate={date}
                tooltip={tooltip}
                backgroundColor={backgroundColor}
                foreColor={foreColor}
                shortText={shortText}
              />
            )
          ),
      )}
    </div>
  )
}
