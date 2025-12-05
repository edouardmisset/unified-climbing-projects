'use client'

import { memo, type ReactNode, useMemo } from 'react'
import { WEEKS_IN_YEAR } from '~/constants/generic.ts'
import { prettyLongDate } from '~/helpers/formatters.ts'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { DaysColumn } from './days-column.tsx'
import { getNumberOfDaysInYear } from './helpers.ts'
import { WeeksRow } from './weeks-row.tsx'
import styles from './year-grid.module.css'
import { YearGridCell } from './year-grid-cell.tsx'

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
          (_, index): DayDescriptor => ({
            date: '',
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
        {allDayCollection.map(
          (
            {
              date,
              backgroundColor,
              shortText = '',
              title,
              isSpecialCase = false,
              ascents,
              trainingSessions,
            },
            index,
          ) => (
            <YearGridCell
              ascents={ascents}
              backgroundColor={backgroundColor}
              date={date}
              formattedDate={date === '' ? '' : prettyLongDate(date)}
              isSpecialCase={isSpecialCase}
              key={(date || index).toString()}
              shortText={shortText}
              title={title}
              trainingSessions={trainingSessions}
              year={year}
            />
          ),
        )}
      </div>
    )
  },
)

export type DayDescriptor = {
  backgroundColor?: string
  date: string
  isSpecialCase?: boolean
  shortText: ReactNode
  title: ReactNode
  // Lazy loading data
  ascents?: Ascent[]
  trainingSessions?: TrainingSession[]
}
