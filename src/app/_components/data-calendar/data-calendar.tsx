import { memo, useMemo } from 'react'
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

export const DataCalendar = memo(
  <Data, DataArray extends (Data & StringDate)[]>(
    props: DataCalendarProps<DataArray, Data>,
  ): React.JSX.Element => {
    const {
      year,
      data,
      dataTransformationFunction,
      fromDataToCalendarEntries,
    } = props

    const yearlyData = useMemo(
      () => dataTransformationFunction(data),
      [data, dataTransformationFunction],
    )
    const dataInSelectedYear = useMemo(
      () => yearlyData[year],
      [year, yearlyData],
    )

    const calendarEntries = useMemo(
      () => fromDataToCalendarEntries(year, dataInSelectedYear),
      [year, dataInSelectedYear, fromDataToCalendarEntries],
    )

    if (dataInSelectedYear === undefined) return <p>Year not found</p>
    if (dataInSelectedYear.length === 0) return <p>No record</p>

    return (
      <div className={styles.calendarContainer}>
        <YearGrid year={year} dayCollection={calendarEntries} />
      </div>
    )
  },
)
