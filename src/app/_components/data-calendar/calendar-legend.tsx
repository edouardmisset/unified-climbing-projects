import styles from './data-calendar.module.css'

export function CalendarLegend({
  items,
  note,
}: {
  items: { color: string; label: string }[]
  note: string
}) {
  return (
    <div className={styles.calendarLegend} aria-label='Calendar key' role='group'>
      <div className={styles.legendItems}>
        {items.map(item => (
          <span className={styles.legendItem} key={item.label}>
            <span
              aria-hidden='true'
              className={styles.legendSwatch}
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
      <p className={styles.legendNote}>{note}</p>
    </div>
  )
}
