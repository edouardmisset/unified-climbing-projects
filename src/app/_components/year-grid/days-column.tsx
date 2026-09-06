import type { CSSProperties } from 'react'
import { WEEKEND_START_DAY_INDEX } from '~/constants/generic'
import { getEnglishWeekdayLabels } from '~/helpers/date'
import styles from './year-grid.module.css'

const weekDays = ['', ...getEnglishWeekdayLabels()]

function DayCell({ day, index }: { day: string; index: number }) {
  const backgroundStyle: CSSProperties | undefined =
    index >= WEEKEND_START_DAY_INDEX ? { backgroundColor: 'var(--surface-3)' } : undefined

  if (index === 0) return <span className={`${styles.yearGridCell} ${styles.firstCell}`} />

  return (
    <span className={`contrastColor ${styles.firstColumn}`} style={backgroundStyle} title={day}>
      {day}
    </span>
  )
}

export function DaysColumn() {
  return weekDays.map((day, index) => <DayCell day={day} index={index} key={day} />)
}
