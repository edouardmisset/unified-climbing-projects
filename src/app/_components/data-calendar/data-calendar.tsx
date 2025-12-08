import { memo, useMemo } from 'react'
import type { StringDate } from '~/types/generic'
import { YearGrid } from '../year-grid/year-grid'
import styles from './data-calendar.module.css'
import { defaultTransform } from './helpers'
import type { DataCalendarProps } from './types'

export const DataCalendar = memo(
  <T extends StringDate>(
    props: DataCalendarProps<T>
  ): React.JSX.Element => {
    const { year, data, config, customTransform } = props
    
    const calendarEntries = useMemo(() => {
      if (customTransform) {
        return customTransform(year, data)
      }
      return defaultTransform(year, data, config)
    }, [year, data, config, customTransform])
    
    if (calendarEntries.length === 0) return <p>No record</p>

    return (
      <div className={styles.calendarContainer}>
        <YearGrid dayCollection={calendarEntries} year={year} />
      </div>
    )
  },
)