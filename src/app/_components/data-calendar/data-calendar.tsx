import type { StringDateTime } from '~/types/generic'
import { Spacer } from '../spacer/spacer'
import { type DayDescriptor, YearGrid } from '../year-grid/year-grid'
import { YearNavigationButton } from '../year-navigation-button/year-navigation-button'
import styles from './data-calendar.module.css'

export default async function DataCalendar<
  Data,
  DataArray extends (Data & StringDateTime)[],
>(props: {
  year: number
  data: DataArray
  dataTransformationFunction: (input: DataArray) => { [year: number]: Data[][] }
  header: string
  fromDataToCalendarEntries: (year: number, data?: Data[][]) => DayDescriptor[]
}) {
  const {
    year,
    data,
    dataTransformationFunction,
    header,
    fromDataToCalendarEntries,
  } = props

  const yearlyData = dataTransformationFunction(data)
  const dataInSelectedYear = yearlyData[year]

  if (dataInSelectedYear === undefined) return <p>Year not found</p>

  const isDataPresentForPreviousYear = Boolean(yearlyData[year - 1])
  const isDataPresentForNextYear = Boolean(yearlyData[year + 1])

  const calendarEntries = fromDataToCalendarEntries(year, dataInSelectedYear)

  return (
    <>
      <h1 className="center-text">
        {header} in {year}
      </h1>
      <Spacer size={3} />
      <div className={styles.navContainer}>
        <YearNavigationButton
          currentYear={year}
          nextOrPrevious="previous"
          enabled={isDataPresentForPreviousYear}
        />
        {dataInSelectedYear.length === 0 ? (
          <span>No record</span>
        ) : (
          <div className={styles.calendarContainer}>
            <YearGrid year={year} dayCollection={calendarEntries} />
          </div>
        )}
        <YearNavigationButton
          currentYear={year}
          nextOrPrevious="next"
          enabled={isDataPresentForNextYear}
        />
      </div>
    </>
  )
}
