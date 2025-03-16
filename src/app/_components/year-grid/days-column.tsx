import { memo } from 'react'
import styles from './year-grid.module.css'

const weekDays = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const DaysColumn = memo(() =>
  weekDays.map((day, index) => {
    return index === 0 ? (
      <i
        key="empty-first-cell"
        className={`${styles.yearGridCell} ${styles.firstCell}`}
      />
    ) : (
      <i
        key={day}
        className={`contrast-color ${styles.firstColumn}`}
        title={day}
        style={
          index % 2 === 0 ? { backgroundColor: 'var(--surface-4)' } : undefined
        }
      >
        {day}
      </i>
    )
  }),
)
