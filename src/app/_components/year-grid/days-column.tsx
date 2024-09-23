import styles from './year-grid.module.css'

export function DaysColumn({ year }: { year: number }) {
  return Array.from({ length: 8 }, (_, index) => {
    const date = new Date()
    date.setFullYear(year)
    date.setMonth(0)
    date.setDate(index)
    return index === 0 ? (
      <div
        key="first-cell"
        className={styles.yearGridCell}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
        }}
      />
    ) : (
      <div
        key={date.toString()}
        className="flex-row center"
        style={{
          minInlineSize: '4ch',
          lineHeight: 1,
        }}
      >
        {date.toDateString().slice(0, 3)}
      </div>
    )
  })
}
