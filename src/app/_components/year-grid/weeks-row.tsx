import styles from './year-grid.module.css'

export async function WeeksRow({ columnCount }: { columnCount: number }) {
  const columns = Array.from({ length: columnCount }, (_, i) => i)

  console.log(columns, columns.length)

  return columns.map(columnNumber => {
    if (columnNumber === 0)
      return <i className={`super-center ${styles.firstCell}`} />

    return (
      <div
        key={`${columnNumber}-column`}
        className={`super-center ${styles.yearGridCell} ${styles.gridHeader}`}
        style={{
          gridColumn: columnNumber + 1,
        }}
      >
        {columnNumber}
      </div>
    )
  })
}
