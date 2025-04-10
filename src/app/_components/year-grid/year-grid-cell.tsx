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
  title?: ReactNode
  isSpecialCase?: boolean
}

export const YearGridCell = memo((props: YearGridCellProps) => {
  const {
    stringDate,
    description,
    backgroundColor,
    shortText = '',
    formattedDate,
    title = formattedDate,
    isSpecialCase = false,
  } = props

  const cellStyle: CSSProperties = useMemo(
    () => ({
      '--color': backgroundColor,
      backgroundColor,
      outline: datesEqual(new Date(stringDate), new Date())
        ? '2px solid var(--text-1)'
        : undefined,
    }),
    [backgroundColor, stringDate],
  )

  if (description === '')
    return (
      <span
        className={styles.yearGridCell}
        style={cellStyle}
        // Here no data is available for the date, so we only display the date
        title={prettyLongDate(stringDate)}
      />
    )

  return (
    <Popover
      triggerContent={shortText}
      popoverTitle={title}
      popoverDescription={description}
      triggerClassName={`${styles.yearGridCell} ${isSpecialCase ? styles.specialCase : ''} contrast-color`}
      buttonStyle={cellStyle}
    />
  )
})
