import { isDateInYear } from '@edouardmisset/date'
import { memo, type ReactNode, Suspense, useMemo } from 'react'
import { prettyLongDate } from '~/helpers/formatters.ts'
import { DaysColumn } from './days-column.tsx'
import { getNumberOfDaysInYear } from './helpers.ts'
import { WeeksRow } from './weeks-row.tsx'
import styles from './year-grid.module.css'
import { YearGridCell } from './year-grid-cell.tsx'

export type DayDescriptor = {
  date: string
  backgroundColor?: string
  description: ReactNode
  title: ReactNode
  shortText: ReactNode
  isSpecialCase?: boolean
}

export const YearGrid = memo(
  ({
    dayCollection,
    year,
  }: {
    year: number
    dayCollection: DayDescriptor[]
  }) => {
    const displayedNumberOfWeeks = Math.ceil(
      (getNumberOfDaysInYear(year) + 1) / 7,
    )
    const firstDayOfYear = new Date(year, 0, 1, 12)
    const firstDayIndex = firstDayOfYear.getUTCDay()
    const prependWeek53 = firstDayIndex >= 4 || firstDayIndex === 0

    const numberOfColumns = 1 + displayedNumberOfWeeks + (prependWeek53 ? 1 : 0)

    const columns = useMemo(
      () => [
        0,
        ...(prependWeek53 ? [53] : []),
        ...Array.from(
          { length: displayedNumberOfWeeks },
          (_, index) => index + 1,
        ),
      ],
      [displayedNumberOfWeeks, prependWeek53],
    )

    const numberOfDaysFromPreviousMondayTo1stJanuary =
      firstDayIndex === 0 ? 6 : firstDayIndex - 1

    const emptyDays = useMemo(
      () =>
        Array.from(
          { length: numberOfDaysFromPreviousMondayTo1stJanuary },
          (_, index): DayDescriptor => ({
            date: '',
            description: '',
            shortText: index.toString(),
            title: '',
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
          (
            {
              date,
              description,
              backgroundColor,
              shortText = '',
              title,
              isSpecialCase = false,
            },
            index,
          ) => (
            <Suspense fallback={'Loading...'} key={date}>
              {date === '' ? (
                <i
                  className={`${styles.yearGridCell} ${styles.emptyGridCell}`}
                  key={shortText?.toString() || index}
                />
              ) : (
                isDateInYear(date, year) && (
                  <YearGridCell
                    backgroundColor={backgroundColor}
                    description={description}
                    formattedDate={prettyLongDate(date)}
                    isSpecialCase={isSpecialCase}
                    key={date.toString()}
                    shortText={shortText}
                    stringDate={date}
                    title={title}
                  />
                )
              )}
            </Suspense>
          ),
        )}
      </div>
    )
  },
)
