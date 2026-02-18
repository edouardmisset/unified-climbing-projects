import { memo, useMemo } from 'react'
import { WEEKS_IN_YEAR } from '~/constants/generic'
import styles from './year-grid.module.css'

const WeekCell = memo(
  ({
    columnNumber,
    index,
    columns,
  }: {
    columnNumber: number
    columns: number[]
    index: number
  }) => {
    const hasExtraColumn = columns[1] === WEEKS_IN_YEAR

    // Adjust the grid column based on the presence of an extra column and the current index
    const adjustedGridColumn =
      hasExtraColumn && index === 1 ? 2 : columnNumber + 1 + (hasExtraColumn ? 1 : 0)

    const gridColumnStyle = useMemo(
      () => ({
        gridColumn: adjustedGridColumn,
      }),
      [adjustedGridColumn],
    )

    if (columnNumber === 0) return <span className={`superCenter ${styles.firstCell}`} key={0} />

    return (
      <span
        className={`superCenter ${styles.yearGridCell} ${styles.gridHeader}`}
        style={gridColumnStyle}
      >
        {columnNumber}
      </span>
    )
  },
)

export const WeeksRow = memo(({ columns }: { columns: number[] }) =>
  columns.map((columnNumber, index) => (
    <WeekCell
      columnNumber={columnNumber}
      columns={columns}
      index={index}
      // oxlint-disable-next-line react/no-array-index-key
      key={`W${columnNumber}-${index}column`}
    />
  )),
)
