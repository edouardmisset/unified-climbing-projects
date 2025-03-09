import type { StringDate } from '~/types/generic'
import { type DayDescriptor, YearGrid } from '../year-grid/year-grid'
import styles from './data-calendar.module.css'

type DataCalendarProps<DataArray extends (Data & StringDate)[], Data> = {
  year: number
  data: DataArray
  dataTransformationFunction: (input: DataArray) => {
    [year: number]: Data[][]
  }
  fromDataToCalendarEntries: (year: number, data?: Data[][]) => DayDescriptor[]
}

export default function DataCalendar<
  Data,
  DataArray extends (Data & StringDate)[],
>(props: DataCalendarProps<DataArray, Data>) {
  const { year, data, dataTransformationFunction, fromDataToCalendarEntries } =
    props

  const yearlyData = dataTransformationFunction(data)
  const dataInSelectedYear = yearlyData[year]

  if (dataInSelectedYear === undefined) return <p>Year not found</p>
  if (dataInSelectedYear.length === 0) return <p>No record</p>

  const calendarEntries = fromDataToCalendarEntries(year, dataInSelectedYear)

  return (
    <div className={styles.calendarContainer}>
      <YearGrid year={year} dayCollection={calendarEntries} />
    </div>
  )
}
