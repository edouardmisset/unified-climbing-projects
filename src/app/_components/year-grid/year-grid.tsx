'use client'

import { Fragment, memo, type ReactNode, useMemo } from 'react'
import { CalendarCell } from '~/app/_components/data-calendar/calendar-cell'
import { WEEKS_IN_YEAR } from '~/constants/generic.ts'
import { DaysColumn } from './days-column.tsx'
import { getNumberOfDaysInYear } from './helpers.ts'
import { WeeksRow } from './weeks-row.tsx'
import styles from './year-grid.module.css'

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
        ...(prependWeek53 ? [WEEKS_IN_YEAR] : []),
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
          (): DayDescriptor => ({
            date: '',
            content: <CalendarCell date="" year={year} />,
          }),
        ),
      [numberOfDaysFromPreviousMondayTo1stJanuary, year],
    )

    const allDayCollection = useMemo(
      () => [...emptyDays, ...dayCollection],
      [emptyDays, dayCollection],
    )
    const gridTemplateStyle = useMemo(
      () => ({
        gridTemplateColumns: `repeat(${numberOfColumns},1fr)`,
      }),
      [numberOfColumns],
    )

    return (
      <div className={styles.yearGrid} style={gridTemplateStyle}>
        <DaysColumn />
        <WeeksRow columns={columns} />
        {allDayCollection.map((day, index) => (
          <Fragment key={day.date || index}>{day.content}</Fragment>
        ))}
      </div>
    )
  },
)

export type DayDescriptor = {
  date: string
  content: ReactNode
}
