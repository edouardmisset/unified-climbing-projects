import { useMemo } from 'react'
import type { StringDate } from '~/types/generic'
import { type DayDescriptor, YearGrid } from '../year-grid/year-grid'
import styles from './data-calendar.module.css'

export function DataCalendar<T extends StringDate>(props: DataCalendarProps<T>): React.JSX.Element {
  const { year, data, dataTransformationFunction, fromDataToCalendarEntries } = props

  const yearlyData = useMemo(
    () => dataTransformationFunction(data),
    [data, dataTransformationFunction],
  )
  const dataInSelectedYear = useMemo(() => yearlyData[year], [year, yearlyData])

  const calendarEntries = useMemo(
    () => fromDataToCalendarEntries(year, dataInSelectedYear),
    [year, dataInSelectedYear, fromDataToCalendarEntries],
  )

  if (dataInSelectedYear === undefined) return <p>Year not found</p>
  if (dataInSelectedYear.length === 0) return <p>No record</p>

  return (
    <div className={styles.calendarContainer}>
      <YearGrid dayCollection={calendarEntries} year={year} />
    </div>
  )
}

type DataCalendarProps<T extends StringDate> = {
  year: number
  data: T[]
  dataTransformationFunction: (input: T[]) => Record<number, T[][]>
  fromDataToCalendarEntries: (year: number, data?: T[][]) => DayDescriptor[]
}
