import { type CSSProperties, type ReactNode, memo, useMemo } from 'react'
import { prettyLongDate } from '~/helpers/formatters'
import { Popover } from '../popover/popover'
import { datesEqual } from './helpers'
import styles from './year-grid.module.css'

type YearGridCellProps = {
  stringDate: string
  description: ReactNode
  backgroundColor: string | undefined
  shortText?: ReactNode
  formattedDate: string
}

export const YearGridCell = memo((props: YearGridCellProps) => {
  const {
    stringDate,
    description,
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

  if (description === '')
    return (
      <span
        className={styles.yearGridCell}
        style={cellStyle}
        title={prettyLongDate(stringDate)}
      />
    )

  return (
    <Popover
      triggerContent={shortText}
      popoverTitle={formattedDate}
      popoverDescription={description}
      triggerClassName={`${styles.yearGridCell} contrast-color`}
      buttonStyle={cellStyle}
    />
  )
})
