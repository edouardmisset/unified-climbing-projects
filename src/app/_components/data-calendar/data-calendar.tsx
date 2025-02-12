import type { StringDate } from '~/types/generic'
import { Spacer } from '../spacer/spacer'
import { type DayDescriptor, YearGrid } from '../year-grid/year-grid'
import { YearNavigationButton } from '../year-navigation-button/year-navigation-button'
import styles from './data-calendar.module.css'

export default async function DataCalendar<
  T,
  U extends (T & StringDate)[],
>(props: {
  year: number
  data: U
  dataTransformationFunction: (input: U) => Record<number, T[]>
  header: string
  fromDataToCalendarEntries: (data?: T[]) => DayDescriptor[]
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

  const isDataPresentForPreviousYear = Boolean(yearlyData[year - 1])
  const isDataPresentForNextYear = Boolean(yearlyData[year + 1])

  const calendarEntries = fromDataToCalendarEntries(dataInSelectedYear)

  if (dataInSelectedYear === undefined) return <div>Year not found</div>

  return (
    <>
      <h1 className="center-text">
        {header} in {year}
      </h1>
      <Spacer size={3} />
      <div className={styles.container}>
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
