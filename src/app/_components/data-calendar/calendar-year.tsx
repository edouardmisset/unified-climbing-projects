import type { ReactNode } from 'react'
import styles from './data-calendar.module.css'

export function CalendarYear({
  children,
  isLatestYear,
  year,
}: {
  children: ReactNode
  isLatestYear: boolean
  year: number
}): React.JSX.Element {
  return (
    <section
      className={`${styles.calendarYear} ${isLatestYear ? '' : styles.historicalYear}`}
      data-calendar-year={year}
      data-latest-year={isLatestYear}
    >
      {children}
    </section>
  )
}
