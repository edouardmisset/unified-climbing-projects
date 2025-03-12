import { type CSSProperties, type ReactNode, memo, useMemo } from 'react'
import Popover from '../popover/popover'
import { datesEqual } from './helpers'
import styles from './year-grid.module.css'

type YearGridCellProps = {
  stringDate: string
  tooltip: ReactNode
  backgroundColor: string | undefined
  shortText?: ReactNode
  formattedDate: string
}

function YearGridCell(props: YearGridCellProps) {
  const {
    stringDate,
    tooltip: title,
    backgroundColor,
    shortText = '',
    formattedDate,
  } = props

  const cellStyle: CSSProperties = useMemo(
    () => ({
      '--color': backgroundColor,
      backgroundColor,
      outline: datesEqual(new Date(stringDate), new Date())
        ? '2px solid var(--text-1)'
        : 'none',
    }),
    [backgroundColor, stringDate],
  )

  return (
    <Popover
      triggerContent={shortText}
      popoverTitle={formattedDate}
      popoverDescription={title}
      triggerClassName={`${styles.yearGridCell} contrast-color`}
      buttonStyle={cellStyle}
    />
  )
}

export default memo(YearGridCell)
