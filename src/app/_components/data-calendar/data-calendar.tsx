import { memo, useMemo } from 'react'
import type { StringDate } from '~/types/generic'
import { YearGrid } from '../year-grid/year-grid'
import styles from './data-calendar.module.css'
import { defaultTransform } from './helpers'
import type { DataCalendarProps } from './types'

const DataCalendarComponent = <T extends StringDate>(
  props: DataCalendarProps<T>,
): React.JSX.Element => {
  const { year, data, config, customTransform } = props

  const calendarEntries = useMemo(
    () =>
      customTransform
        ? customTransform(year, data)
        : defaultTransform(year, data, config),
    [year, data, config, customTransform],
  )

  if (calendarEntries.length === 0) return <p>No record</p>

  return (
    <div className={styles.calendarContainer}>
      <YearGrid dayCollection={calendarEntries} year={year} />
    </div>
  )
}

export const DataCalendar = memo(
  DataCalendarComponent,
) as typeof DataCalendarComponent
