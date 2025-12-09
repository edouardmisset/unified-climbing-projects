'use client'

import {
  type CSSProperties,
  memo,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { prettyLongDate } from '~/helpers/formatters'
import { Popover } from '../popover/popover'
import { datesEqual } from '../year-grid/helpers'
import styles from '../year-grid/year-grid.module.css'

export interface CalendarCellProps {
  date: string
  year: number
  backgroundColor?: string
  shortText?: ReactNode
  title?: ReactNode
  description?: ReactNode
  isSpecialCase?: boolean
  loading?: boolean
}

export const CalendarCell = memo((props: CalendarCellProps) => {
  const {
    date,
    year,
    backgroundColor,
    shortText = '',
    title = prettyLongDate(date),
    description,
    isSpecialCase = false,
    loading,
  } = props

  const [isToday, setIsToday] = useState(false)

  useEffect(() => {
    if (date) {
      setIsToday(datesEqual(new Date(date), new Date()))
    }
  }, [date])

  const cellStyle: CSSProperties = useMemo(
    () => ({
      '--color': backgroundColor,
      backgroundColor: getAdjustedBackgroundColor({
        backgroundColor,
        date,
      }),
      outline: isToday ? '2px solid var(--text-1)' : undefined,
    }),
    [backgroundColor, date, isToday],
  )

  const loadingStyle = useMemo(() => {
    if (!loading || !date) return {}

    const dateObj = new Date(date)
    const startOfYear = new Date(Date.UTC(year, 0, 1))
    const dayOfYear = Math.floor(
      (dateObj.getTime() - startOfYear.getTime()) / 86400000,
    )
    const weekIndex = Math.floor(dayOfYear / 7)

    // Stagger delay by 0.05s per week to create a wave effect
    const waveDelay = weekIndex * 0.05

    // Offset each year by 1/5 of a cycle (2s / 5 = 0.4s)
    const yearOffset = (year % 5) * -0.4

    // Add a delay per year (1s per year)
    const yearDelay = year * 0.0005

    return {
      '--pulse-delay': `${waveDelay + yearOffset + yearDelay}s`,
    } as CSSProperties
  }, [loading, date, year])

  if (loading) {
    return (
      <span
        className={`${styles.yearGridCell} ${styles.loading}`}
        style={{ ...cellStyle, ...loadingStyle }}
      />
    )
  }

  if (
    date === '' ||
    new Date(date).getUTCFullYear() !== year ||
    !description ||
    description === ''
  ) {
    return <EmptyGridCell cellStyle={cellStyle} date={date} />
  }

  return (
    <Popover
      buttonStyle={cellStyle}
      popoverDescription={description}
      popoverTitle={title}
      triggerClassName={`${styles.yearGridCell} ${isSpecialCase ? styles.specialCase : ''} contrastColor`}
      triggerContent={shortText}
    />
  )
})

const EmptyGridCell = memo(
  ({ cellStyle, date }: { cellStyle: CSSProperties; date: string }) => (
    <span
      className={`${styles.yearGridCell} ${styles.emptyGridCell}`}
      style={cellStyle}
      title={prettyLongDate(date)}
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
  if (date === '') return 'transparent'

  // Use getUTCDay because date is generated as UTC noon
  const day = new Date(date).getUTCDay()
  const isWeekend = day === 0 || day === 6

  if (isWeekend) return 'var(--surface-3)'

  return
}
