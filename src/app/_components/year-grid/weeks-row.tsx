import styles from './year-grid.module.css'

export function WeeksRow() {
  return Array.from({ length: 53 }, (_, index) => {
    return index === 0 ? null : (
        <div
          key={`${index}-week`}
          className={`super-center ${styles.yearGridCell} ${styles.gridHeader}`}
          style={{
            minBlockSize: '3ch',
            gridColumn: index + 1,
            gridRow: 1,
            fontWeight: 'bold',
          }}
        >
          {index}
        </div>
      )
  })
}
