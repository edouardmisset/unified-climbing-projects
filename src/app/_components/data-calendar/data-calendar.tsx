'use client'

import { memo, Suspense, use, useMemo } from 'react'
import type { StringDate } from '~/types/generic'
import { YearGrid } from '../year-grid/year-grid'
import { CalendarCell } from './calendar-cell'
import styles from './data-calendar.module.css'
import { defaultTransform } from './helpers'
import type { DataCalendarProps } from './types'

const DataCalendarContent = <T extends StringDate>(
  props: DataCalendarProps<T>,
): React.JSX.Element => {
  const { year, data, renderDay } = props

  const resolvedData = data instanceof Promise ? use(data) : data
  const safeData = useMemo(() => resolvedData || [], [resolvedData])

  const calendarEntries = useMemo(
    () => defaultTransform(year, safeData, renderDay),
    [year, safeData, renderDay],
  )

  if (calendarEntries.length === 0) return <p>No record</p>

  return (
    <div className={styles.calendarContainer}>
      <YearGrid dayCollection={calendarEntries} year={year} />
    </div>
  )
}

const DataCalendarSkeleton = memo(({ year }: { year: number }) => {
  const emptyEntries = useMemo(
    () =>
      defaultTransform(year, [], (_, date) => (
        <CalendarCell date={date} loading year={year} />
      )),
    [year],
  )

  return (
    <div className={styles.calendarContainer}>
      <YearGrid dayCollection={emptyEntries} year={year} />
    </div>
  )
})

const DataCalendarComponent = <T extends StringDate>(
  props: DataCalendarProps<T>,
): React.JSX.Element => (
  <Suspense fallback={<DataCalendarSkeleton year={props.year} />}>
    <DataCalendarContent {...props} />
  </Suspense>
)

export const DataCalendar = memo(
  DataCalendarComponent,
) as typeof DataCalendarComponent
