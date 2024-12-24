import { nonCalendarRowCount } from './constants'
import styles from './year-grid.module.css'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
for (let index = 0; index < nonCalendarRowCount; index++) {
  weekDays.unshift('')
}

export async function DaysColumn() {
  return weekDays.map((day, index) => {
    return index === 0 ? (
      <i
        key="empty-first-cell"
        className={`${styles.yearGridCell} ${styles.firstCell}`}
      />
    ) : (
      <i key={day} className={`flex-row center ${styles.firstColumn}`}>
        {day}
      </i>
    )
  })
}
