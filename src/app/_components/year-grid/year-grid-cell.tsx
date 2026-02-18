import { isDateInYear } from '@edouardmisset/date'
import { type CSSProperties, lazy, memo, type ReactNode, Suspense, useMemo } from 'react'
import { SATURDAY_DAY_NUMBER } from '~/constants/generic'
import { prettyLongDate } from '~/helpers/formatters'
import { Popover } from '../popover/popover'
import { datesEqual } from './helpers'
import type { DayDescriptor } from './year-grid'
import styles from './year-grid.module.css'

// Lazy load the popover components
const AscentsPopoverDescription = lazy(async () =>
  import('~/app/_components/ascents-popover-description/ascents-popover-description').then(
    module => ({ default: module.AscentsPopoverDescription }),
  ),
)

const TrainingPopoverDescription = lazy(async () =>
  import('~/app/_components/training-popover-description/training-popover-description').then(
    module => ({ default: module.TrainingPopoverDescription }),
  ),
)

export const YearGridCell = memo((props: YearGridCellProps) => {
  const {
    date,
    backgroundColor,
    shortText = '',
    formattedDate,
    title = formattedDate,
    isSpecialCase = false,
    year,
    ascents,
    trainingSessions,
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

  // LAZY LOADING: Create description component only when we have data
  const lazyDescription = useMemo(() => {
    if (ascents && ascents.length > 0) {
      return (
        <Suspense fallback='Loading...'>
          <AscentsPopoverDescription ascents={ascents} />
        </Suspense>
      )
    }
    if (trainingSessions && trainingSessions.length > 0) {
      return (
        <Suspense fallback='Loading...'>
          <TrainingPopoverDescription trainingSessions={trainingSessions} />
        </Suspense>
      )
    }
    return ''
  }, [ascents, trainingSessions])

  if (date === '' || !isDateInYear(date, year))
    return <EmptyGridCell cellStyle={cellStyle} date={date} />

  if (lazyDescription === '' || date === '')
    return <EmptyGridCell cellStyle={cellStyle} date={date} />

  return (
    <Popover
      buttonStyle={cellStyle}
      popoverDescription={lazyDescription}
      popoverTitle={title}
      triggerClassName={`${styles.yearGridCell} ${isSpecialCase ? styles.specialCase : ''} contrastColor`}
      triggerContent={shortText}
    />
  )
})

const EmptyGridCell = memo(({ cellStyle, date }: { cellStyle: CSSProperties; date: string }) => (
  <span
    className={`${styles.yearGridCell} ${styles.emptyGridCell}`}
    style={cellStyle}
    // Here no data is available for the date, so we only display the date itself
    title={prettyLongDate(date)}
  />
))

const getAdjustedBackgroundColor = ({
  backgroundColor,
  date,
}: {
  backgroundColor?: string
  date: string
}): CSSProperties['backgroundColor'] => {
  if (backgroundColor) return backgroundColor

  const day = new Date(date).getDay()
  const isWeekend = day === 0 || day === SATURDAY_DAY_NUMBER

  if (date === '') return 'transparent'
  if (isWeekend) return 'var(--surface-3)'

  return
}

const getOutlineForToday = (date: string): CSSProperties['outline'] => {
  if (date === '') return

  if (datesEqual(new Date(date), new Date())) return '2px solid var(--text-1)'

  return
}

type YearGridCellProps = Omit<DayDescriptor, 'shortText' | 'title'> & {
  formattedDate: string
  shortText?: ReactNode
  title?: ReactNode
  year: number
}
