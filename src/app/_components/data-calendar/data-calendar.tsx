'use client'

import { memo, Suspense, use, useMemo } from 'react'
import { prettyLongDate } from '~/helpers/formatters'
import type { StringDate } from '~/types/generic'
import { YearGrid, type DayDescriptor } from '../year-grid/year-grid'
import { CalendarCell } from './calendar-cell'
import styles from './data-calendar.module.css'
import { getDaysInYear, groupDataByYear, transformToCalendarEntries } from './helpers'
import type { CalendarCellRender, DataCalendarProps, DayTransform } from './types'

const INTENSITY_CLASSES = [
  styles.intensity0,
  styles.intensity1,
  styles.intensity2,
  styles.intensity3,
  styles.intensity4,
  styles.intensity5,
]

const defaultDayTransform: DayTransform<StringDate> = ({
  items,
  date,
  maxCount,
}) => {
  const count = items.length
  const hasContent = count > 0
  const ratio = maxCount === 0 ? 0 : count / maxCount
  const bucket = hasContent
    ? Math.min(INTENSITY_CLASSES.length - 1, Math.ceil(ratio * (INTENSITY_CLASSES.length - 1)))
    : 0
  const className = INTENSITY_CLASSES[bucket]

  return {
    date,
    content: hasContent ? count : undefined,
    className,
    popoverTitle: prettyLongDate(date),
    isEmpty: !hasContent,
  }
}

const mapToDescriptors = (cells: CalendarCellRender[]): DayDescriptor[] =>
  cells.map(cell => ({ date: cell.date, content: <CalendarCell {...cell} /> }))

const buildYearData = <T extends StringDate>(year: number, data: T[]) => {
  const grouped = groupDataByYear(data)
  const daysInYear = getDaysInYear(year)

  return grouped[year] ?? Array.from({ length: daysInYear }, () => [])
}

const DataCalendarContent = <T extends StringDate>(
  props: DataCalendarProps<T>,
): React.JSX.Element => {
  const { year, data, transformDay } = props

  const resolvedData = data instanceof Promise ? use(data) : data
  const safeData = useMemo(() => resolvedData ?? [], [resolvedData])

  const yearData = useMemo(() => buildYearData(year, safeData), [safeData, year])

  const maxCount = useMemo(
    () => Math.max(...yearData.map(day => day.length), 0),
    [yearData],
  )

  const dayTransform = useMemo<DayTransform<T>>(
    () => transformDay ?? (defaultDayTransform as DayTransform<T>),
    [transformDay],
  )

  const calendarEntries = useMemo(() => {
    const cells = transformToCalendarEntries(year, yearData, dayTransform, maxCount)
    return mapToDescriptors(cells)
  }, [year, yearData, dayTransform, maxCount])

  if (calendarEntries.length === 0) return <p>No record</p>

  return (
    <div className={styles.calendarContainer}>
      <YearGrid dayCollection={calendarEntries} year={year} />
    </div>
  )
}

const DataCalendarSkeleton = memo(({ year }: { year: number }) => {
  const emptyEntries = useMemo(() => {
    const emptyData = Array.from({ length: getDaysInYear(year) }, () => [])
    const cells = transformToCalendarEntries(
      year,
      emptyData,
      ({ date }) => ({ date, isLoading: true }),
      0,
    )

    return mapToDescriptors(cells)
  }, [year])

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
