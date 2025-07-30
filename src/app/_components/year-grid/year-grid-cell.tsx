import { isDateInYear } from '@edouardmisset/date'
import { type CSSProperties, memo, type ReactNode, useMemo } from 'react'
import { prettyLongDate } from '~/helpers/formatters'
import { Popover } from '../popover/popover'
import { datesEqual } from './helpers'
import type { DayDescriptor } from './year-grid'
import styles from './year-grid.module.css'

export const YearGridCell = memo((props: YearGridCellProps) => {
  const {
    date,
    description,
    backgroundColor,
    shortText = '',
    formattedDate,
    title = formattedDate,
    isSpecialCase = false,
    year,
  } = props

  const cellStyle: CSSProperties = useMemo(
    () => ({
      '--color': backgroundColor,
      backgroundColor: getAdjustedBackgroundColor({
        backgroundColor,
        date,
      }),
      outline: getOutlineForToday(date),
    }),
    [backgroundColor, date],
  )

  if (date === '' || !isDateInYear(date, year))
    return <EmptyGridCell cellStyle={cellStyle} date={date} />

  if (description === '' || date === '')
    return <EmptyGridCell cellStyle={cellStyle} date={date} />

  return (
    <Popover
      buttonStyle={cellStyle}
      popoverDescription={description}
      popoverTitle={title}
      triggerClassName={`${styles.yearGridCell} ${isSpecialCase ? styles.specialCase : ''} contrast-color`}
      triggerContent={shortText}
    />
  )
})

const EmptyGridCell = memo(
  ({ cellStyle, date }: { cellStyle: CSSProperties; date: string }) => (
    <span
      className={`${styles.yearGridCell} ${styles.emptyGridCell}`}
      style={cellStyle}
      // Here no data is available for the date, so we only display the date itself
      title={date ? prettyLongDate(date) : undefined}
    />
  ),
)

const getAdjustedBackgroundColor = ({
  backgroundColor,
  date,
}: {
  backgroundColor?: string
  date: string
}): CSSProperties['backgroundColor'] => {
  if (backgroundColor) return backgroundColor

  const day = new Date(date).getDay()
  const isWeekend = day === 0 || day === 6

  if (date === '') return 'transparent'
  if (isWeekend) return 'var(--surface-3)'

  return undefined
}

const getOutlineForToday = (date: string): CSSProperties['outline'] => {
  if (date === '') return undefined

  if (datesEqual(new Date(date), new Date())) return '2px solid var(--text-1)'

  return undefined
}

type YearGridCellProps = Omit<DayDescriptor, 'shortText' | 'title'> & {
  formattedDate: string
  shortText?: ReactNode
  title?: ReactNode
  year: number
}
