import { memo } from 'react'
import styles from './year-grid.module.css'

const weekDays = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const DaysColumn = memo(() =>
  weekDays.map((day, index) => {
    return index === 0 ? (
      <i
        className={`${styles.yearGridCell} ${styles.firstCell}`}
        key="empty-first-cell"
      />
    ) : (
      <i
        className={`contrast-color ${styles.firstColumn}`}
        key={day}
        style={
          index % 2 === 0 ? { backgroundColor: 'var(--surface-4)' } : undefined
        }
        title={day}
      >
        {day}
      </i>
    )
  }),
)
