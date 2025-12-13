'use client'

import { type CSSProperties, memo, type ReactNode, useMemo } from 'react'
import { prettyLongDate } from '~/helpers/formatters'
import { Popover } from '../popover/popover'
import { datesEqual } from '../year-grid/helpers'
import styles from '../year-grid/year-grid.module.css'

export interface CalendarCellProps {
  date: string
  content?: ReactNode
  popoverTitle?: ReactNode
  popoverDescription?: ReactNode
  isSpecialCase?: boolean
  isLoading?: boolean
  isEmpty?: boolean
  style?: CSSProperties
  className?: string
}

export const CalendarCell = memo((props: CalendarCellProps) => {
  const {
    date,
    content,
    popoverTitle = prettyLongDate(date),
    popoverDescription,
    isSpecialCase = false,
    isLoading,
    isEmpty,
    style,
    className,
  } = props

  const dateValue = useMemo(() => (date ? new Date(date) : undefined), [date])

  const isToday = useMemo(
    () => (dateValue ? datesEqual(dateValue, new Date()) : false),
    [dateValue],
  )

  const isWeekend = useMemo(() => {
    if (!dateValue) return false
    const day = dateValue.getUTCDay()
    return day === 0 || day === 6
  }, [dateValue])

  const cellStyle: CSSProperties = useMemo(() => ({ ...style }), [style])

  const loadingStyle = useMemo(() => {
    if (!isLoading || !dateValue) return {}

    const currentYear = new Date().getUTCFullYear()
    const year = dateValue.getUTCFullYear()
    const startOfYear = new Date(Date.UTC(year, 0, 1))
    const dayOfYear = Math.floor(
      (dateValue.getTime() - startOfYear.getTime()) / 86_400_000,
    )
    const weekIndex = Math.floor(dayOfYear / 7)
    const yearIndex = currentYear - year

    const waveDelay = weekIndex * 0.05
    const yearOffset = (yearIndex % 5) * 0.4
    const yearDelay = yearIndex * 0.5

    return {
      '--pulse-delay': `${waveDelay + yearOffset + yearDelay}s`,
    } as CSSProperties
  }, [isLoading, dateValue])

  const baseClassName = `${styles.yearGridCell} ${
    isSpecialCase ? styles.specialCase : ''
  } ${isWeekend ? styles.weekend : ''} ${isToday ? styles.today : ''} ${className ?? ''}`

  if (isLoading) {
    return (
      <span
        className={`${styles.yearGridCell} ${styles.loading} ${isWeekend ? styles.weekend : ''}`}
        style={{ ...cellStyle, ...loadingStyle }}
      />
    )
  }

  if (!dateValue || isEmpty) {
    return (
      <span
        className={`${styles.yearGridCell} ${styles.emptyGridCell}`}
        title={prettyLongDate(date)}
      />
    )
  }

  if (popoverDescription) {
    return (
      <Popover
        buttonStyle={cellStyle}
        popoverDescription={popoverDescription}
        popoverTitle={popoverTitle}
        triggerClassName={`${baseClassName} contrastColor`}
        triggerContent={content}
      />
    )
  }

  return (
    <span
      className={`${baseClassName} contrastColor`}
      style={cellStyle}
      title={prettyLongDate(date)}
    >
      {content}
    </span>
  )
})
