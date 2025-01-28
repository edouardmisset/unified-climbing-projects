import styles from './year-grid.module.css'

const weekDays = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export async function DaysColumn() {
  return weekDays.map((day, index) => {
    return index === 0 ? (
      <i
        key="empty-first-cell"
        className={`${styles.yearGridCell} ${styles.firstCell}`}
      />
    ) : (
      <span
        key={day}
        className={`contrast-color ${styles.firstColumn}`}
        title={day}
        style={
          index % 2 === 0 ? { backgroundColor: 'var(--surface-4)' } : undefined
        }
      >
        {day}
      </span>
    )
  })
}
