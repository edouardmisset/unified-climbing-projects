import { isDateInYear } from '~/helpers/is-date-in-year.ts'
import { nonCalendarColumnCount } from './constants.ts'
import { DaysColumn } from './days-column.tsx'
import { getISOWeeksInYear, getWeek } from './helpers.ts'
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
  const weeksInYear = getISOWeeksInYear(year)
  const firstDayOfYearDate = new Date(year, 0, 1)
  const isFirstDayOfTheYearAMondayOnWeek53 =
    getWeek(firstDayOfYearDate) === 53 && firstDayOfYearDate.getDay() === 1

  const numberOfColumns =
    weeksInYear +
    nonCalendarColumnCount +
    (isFirstDayOfTheYearAMondayOnWeek53 ? 1 : 0)
  return (
    <div
      className={styles.yearGrid}
      style={{
        gridTemplateColumns: `repeat(${numberOfColumns},1fr)`,
      }}
    >
      <DaysColumn />
      <WeeksRow year={year} />
      {dayCollection.map(
        ({ date, tooltip, backgroundColor, foreColor, shortText = '' }) =>
          isDateInYear(date, year) ? (
            <YearGridCell
              key={date.toString()}
              stringDate={date}
              tooltip={tooltip}
              backgroundColor={backgroundColor}
              foreColor={foreColor}
              shortText={shortText}
            />
          ) : null,
      )}
    </div>
  )
}
