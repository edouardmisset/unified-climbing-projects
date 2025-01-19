import { type CSSProperties, useMemo } from 'react'
import { datesEqual } from './helpers'

import styles from './year-grid.module.css'

export async function YearGridCell(props: {
  stringDate: string
  tooltip: string
  backgroundColor: string | undefined
  shortText?: string
}) {
  const { stringDate, tooltip: title, backgroundColor, shortText = '' } = props

  const cellStyle: CSSProperties = useMemo(
    () => ({
      backgroundColor,
      outline: datesEqual(new Date(stringDate), new Date())
        ? '2px solid var(--text-1)'
        : 'none',
      '--color': backgroundColor,
    }),
    [backgroundColor, stringDate],
  )

  return (
    <i
      title={title}
      className={`${styles.yearGridCell} contrast-color`}
      style={cellStyle}
      tabIndex={0}
    >
      {shortText}
    </i>
  )
}
