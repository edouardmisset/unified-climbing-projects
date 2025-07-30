import { type CSSProperties, memo, useMemo } from 'react'
import styles from './year-grid.module.css'

const weekDays = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const DayCell = memo(({ day, index }: { day: string; index: number }) => {
  const backgroundStyle: CSSProperties | undefined = useMemo(
    () => (index >= 6 ? { backgroundColor: 'var(--surface-3)' } : undefined),
    [index],
  )

  if (index === 0)
    return <span className={`${styles.yearGridCell} ${styles.firstCell}`} />

  return (
    <span
      className={`contrast-color ${styles.firstColumn}`}
      style={backgroundStyle}
      title={day}
    >
      {day}
    </span>
  )
})

export function DaysColumn() {
  return weekDays.map((day, index) => (
    <DayCell day={day} index={index} key={day} />
  ))
}
