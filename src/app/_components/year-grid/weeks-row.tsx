import styles from './year-grid.module.css'

export async function WeeksRow({ columns }: { columns: number[] }) {
  return columns.map((columnNumber, index) => {
    if (columnNumber === 0)
      return <i className={`super-center ${styles.firstCell}`} />

    const hasExtraColumn = columns[1] === 53

    // Adjust the grid column based on the presence of an extra column and the current index
    const adjustedGridColumn =
      hasExtraColumn && index === 1
        ? 2
        : columnNumber + 1 + (hasExtraColumn ? 1 : 0)

    return (
      <div
        // biome-ignore lint/suspicious/noArrayIndexKey: We need to differentiate the two 53 columns, so we use the index as the key
        key={`W${columnNumber}-${index}column`}
        className={`super-center ${styles.yearGridCell} ${styles.gridHeader}`}
        style={{
          gridColumn: adjustedGridColumn,
        }}
      >
        {columnNumber}
      </div>
    )
  })
}
