import { memo, type CSSProperties } from 'react'
import { prettyLongDate } from '~/helpers/formatters'
import styles from './year-grid.module.css'

type EmptyGridCellProps = {
  cellStyle: CSSProperties
  date: string
  id?: string
}

function EmptyGridCellComponent(props: EmptyGridCellProps) {
  const { cellStyle, date, id } = props

  return (
    <span
      className={`${styles.yearGridCell} ${styles.emptyGridCell}`}
      id={id}
      style={cellStyle}
      // Here no data is available for the date, so we only display the date itself
      title={prettyLongDate(date)}
    />
  )
}

export const EmptyGridCell = memo(EmptyGridCellComponent)
