import type { StringDate } from '~/types/generic'
import { type DayDescriptor, YearGrid } from '../year-grid/year-grid'
import styles from './data-calendar.module.css'

export function DataCalendar<T extends StringDate>(props: DataCalendarProps<T>): React.JSX.Element {
  const { year, data, dataTransformationFunction, fromDataToCalendarEntries } = props

  const yearlyData = dataTransformationFunction(data)
  const dataInSelectedYear = yearlyData[year]

  const calendarEntries = fromDataToCalendarEntries(year, dataInSelectedYear)

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
