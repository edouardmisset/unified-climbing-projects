import { nonCalendarColumnCount } from './constants'
import { getISOWeeksInYear, isFirstDayInFirstISOWeek } from './helpers'
import styles from './year-grid.module.css'

export async function WeeksRow({ year }: { year: number }) {
  const weeksInYear = getISOWeeksInYear(year)

  const isMondayInFirstWeek = isFirstDayInFirstISOWeek(year)
  const isFirstWeekStart = isMondayInFirstWeek ? 0 : 1
  const weeksArray = Array.from({
    length: weeksInYear + isFirstWeekStart + nonCalendarColumnCount,
  })

  return weeksArray.map((_, index) => {
    if (index === 0) return null

    if (index === 1 && !isMondayInFirstWeek) {
      return (
        <div
          key={`week-53-${year - 1}`}
          className={`super-center ${styles.yearGridCell} ${styles.gridHeader}`}
          style={{
            gridColumn: index + nonCalendarColumnCount,
          }}
        >
          53
        </div>
      )
    }

    return (
      <div
        // biome-ignore lint/suspicious/noArrayIndexKey: don't know how to do better
        key={`${index}-week`}
        className={`super-center ${styles.yearGridCell} ${styles.gridHeader}`}
        style={{
          gridColumn: index + nonCalendarColumnCount,
        }}
      >
        {index - 1}
      </div>
    )
  })
}
