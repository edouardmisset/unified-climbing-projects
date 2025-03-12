import { type ReactNode, useMemo } from 'react'
import { formatDateInTooltip } from '~/helpers/formatters.ts'
import { isDateInYear } from '~/helpers/is-date-in-year.ts'
import { DaysColumn } from './days-column.tsx'
import { getNumberOfDaysInYear } from './helpers.ts'
import { WeeksRow } from './weeks-row.tsx'
import YearGridCell from './year-grid-cell.tsx'
import styles from './year-grid.module.css'

export type DayDescriptor = {
  date: string
  backgroundColor?: string
  description: ReactNode
  title: ReactNode
  shortText: ReactNode
}

export function YearGrid({
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

  const numberOfDaysFromPreviousMondayTo1stJanuary =
    firstDayIndex === 0 ? 6 : firstDayIndex - 1

  const emptyDays = useMemo(
    () =>
      Array.from(
        { length: numberOfDaysFromPreviousMondayTo1stJanuary },
        (_, index): DayDescriptor => ({
          date: '',
          description: '',
          title: '',
          shortText: index.toString(),
        }),
      ),
    [numberOfDaysFromPreviousMondayTo1stJanuary],
  )

  const allDayCollection = useMemo(
    () => [...emptyDays, ...dayCollection],
    [emptyDays, dayCollection],
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
      {allDayCollection.map(
        ({ date, description, backgroundColor, shortText = '' }, index) =>
          date === '' ? (
            <i
              key={shortText?.toString() || index}
              className={`${styles.yearGridCell} ${styles.emptyGridCell}`}
            />
          ) : (
            isDateInYear(date, year) && (
              <YearGridCell
                key={date.toString()}
                formattedDate={formatDateInTooltip(date)}
                stringDate={date}
                tooltip={description}
                backgroundColor={backgroundColor}
                shortText={shortText}
              />
            )
          ),
      )}
    </div>
  )
}
