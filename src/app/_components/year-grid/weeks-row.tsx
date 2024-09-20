import styles from './year-grid.module.css'

export function WeeksRow() {
  return Array.from({ length: 53 }, (_, index) => {
    return index === 0 ? null : (
      <div
        // biome-ignore lint/suspicious/noArrayIndexKey: don't know how to do better
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
