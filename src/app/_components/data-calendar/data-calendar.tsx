import { memo, useMemo } from 'react'
import type { StringDate } from '~/types/generic'
import { type DayDescriptor, YearGrid } from '../year-grid/year-grid'
import styles from './data-calendar.module.css'
import { defaultTransform } from './helpers'
import type { DataCalendarProps } from './types'

// Legacy type for backward compatibility
type LegacyDataCalendarProps<DataArray extends (Data & StringDate)[], Data> = {
  year: number
  data: DataArray
  dataTransformationFunction: (input: DataArray) => {
    [year: number]: Data[][]
  }
  fromDataToCalendarEntries: (year: number, data?: Data[][]) => DayDescriptor[]
}

type CombinedDataCalendarProps<T extends StringDate> = 
  | DataCalendarProps<T>
  | LegacyDataCalendarProps<T[], StringDate>

export const DataCalendar = memo(
  <T extends StringDate>(
    props: CombinedDataCalendarProps<T>
  ): React.JSX.Element => {
    // Check if it's the new simplified API
    const isNewAPI = 'config' in props || 'customTransform' in props
    
    // Always call all hooks to maintain hook order
    const newApiCalendarEntries = useMemo(() => {
      if (!isNewAPI) return []
      const { year, data, config, customTransform } = props as DataCalendarProps<T>
      
      if (customTransform) {
        return customTransform(year, data)
      }
      return defaultTransform(year, data, config)
    }, [isNewAPI, props])
    
    const legacyApiYearlyData = useMemo(() => {
      if (isNewAPI) return {}
      const { data, dataTransformationFunction } = props as LegacyDataCalendarProps<T[], StringDate>
      return dataTransformationFunction(data)
    }, [isNewAPI, props])
    
    const legacyApiDataInSelectedYear = useMemo(() => {
      if (isNewAPI) return []
      const { year } = props as LegacyDataCalendarProps<T[], StringDate>
      return legacyApiYearlyData[year]
    }, [isNewAPI, props, legacyApiYearlyData])
    
    const legacyApiCalendarEntries = useMemo(() => {
      if (isNewAPI) return []
      const { year, fromDataToCalendarEntries } = props as LegacyDataCalendarProps<T[], StringDate>
      return fromDataToCalendarEntries(year, legacyApiDataInSelectedYear)
    }, [isNewAPI, props, legacyApiDataInSelectedYear])
    
    // Choose the appropriate entries and year based on API type
    const calendarEntries = isNewAPI ? newApiCalendarEntries : legacyApiCalendarEntries
    const dataInSelectedYear = isNewAPI ? [] : legacyApiDataInSelectedYear
    const year = isNewAPI 
      ? (props as DataCalendarProps<T>).year 
      : (props as LegacyDataCalendarProps<T[], StringDate>).year
    
    // Handle different empty states
    if (isNewAPI) {
      if (calendarEntries.length === 0) return <p>No record</p>
    } else {
      if (dataInSelectedYear === undefined) return <p>Year not found</p>
      if (dataInSelectedYear.length === 0) return <p>No record</p>
    }

    return (
      <div className={styles.calendarContainer}>
        <YearGrid dayCollection={calendarEntries} year={year} />
      </div>
    )
  },
)