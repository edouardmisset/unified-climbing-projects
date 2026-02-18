import { type CSSProperties, memo, useMemo } from 'react'
import { WEEKEND_START_DAY_INDEX } from '~/constants/generic'
import styles from './year-grid.module.css'

const weekDays = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const DayCell = memo(({ day, index }: { day: string; index: number }) => {
  const backgroundStyle: CSSProperties | undefined = useMemo(
    () => (index >= WEEKEND_START_DAY_INDEX ? { backgroundColor: 'var(--surface-3)' } : undefined),
    [index],
  )

  if (index === 0) return <span className={`${styles.yearGridCell} ${styles.firstCell}`} />

  return (
    <span className={`contrastColor ${styles.firstColumn}`} style={backgroundStyle} title={day}>
      {day}
    </span>
  )
})

export function DaysColumn() {
  return weekDays.map((day, index) => <DayCell day={day} index={index} key={day} />)
}
