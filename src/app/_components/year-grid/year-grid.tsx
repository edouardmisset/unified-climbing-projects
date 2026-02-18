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

const DAYS_IN_WEEK = 7
const SUNDAY_INDEX = 0
const MONDAY_INDEX = 1
const WEEK_53_START_INDEX = 4
const MIDDAY_HOUR = 12
const PREVIOUS_MONDAY_OFFSET = 6

export const YearGrid = memo(
  ({ dayCollection, year }: { year: number; dayCollection: DayDescriptor[] }) => {
    const displayedNumberOfWeeks = Math.ceil((getNumberOfDaysInYear(year) + 1) / DAYS_IN_WEEK)
    const firstDayOfYear = new Date(year, 0, 1, MIDDAY_HOUR)
    const firstDayIndex = firstDayOfYear.getUTCDay()
    const prependWeek53 = firstDayIndex >= WEEK_53_START_INDEX || firstDayIndex === SUNDAY_INDEX

    const numberOfColumns = 1 + displayedNumberOfWeeks + (prependWeek53 ? 1 : 0)

    const columns = useMemo(
      () => [
        0,
        ...(prependWeek53 ? [WEEKS_IN_YEAR] : []),
        ...Array.from({ length: displayedNumberOfWeeks }, (_, index) => index + 1),
      ],
      [displayedNumberOfWeeks, prependWeek53],
    )

    const numberOfDaysFromPreviousMondayTo1stJanuary =
      firstDayIndex === SUNDAY_INDEX ? PREVIOUS_MONDAY_OFFSET : firstDayIndex - MONDAY_INDEX

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
              // oxlint-disable-next-line react/no-array-index-key -- stable day index for empty dates
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
