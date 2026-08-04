import { isDateInYear } from '@edouardmisset/date'
import { type CSSProperties, lazy, type ReactNode, Suspense } from 'react'
import { SATURDAY_DAY_NUMBER } from '~/constants/generic'
import { Popover } from '../ui/popover/popover'
import { EmptyGridCell } from './empty-grid-cell'
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

export const YearGridCell = (props: YearGridCellProps) => {
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

  const cellStyle: CSSProperties & { '--color'?: string } = {
    '--color': backgroundColor,
    backgroundColor: getAdjustedBackgroundColor({
      backgroundColor,
      date,
    }),
    outline: getOutlineForToday(date),
  }

  const lazyDescription = getLazyDescription(ascents, trainingSessions)

  if (date === '' || !isDateInYear(date, year))
    return <EmptyGridCell cellStyle={cellStyle} date={date} />

  if (lazyDescription === '' || date === '')
    return <EmptyGridCell cellStyle={cellStyle} date={date} />

  return (
    <Popover
      className={`${styles.yearGridCell} ${isSpecialCase ? styles.specialCase : ''} contrastColor`}
      popoverTitle={title}
      style={cellStyle}
      trigger={shortText}
    >
      {lazyDescription}
    </Popover>
  )
}

function getLazyDescription(
  ascents: YearGridCellProps['ascents'],
  trainingSessions: YearGridCellProps['trainingSessions'],
): ReactNode {
  const hasAscents = ascents !== undefined && ascents.length > 0
  const hasTrainingSessions = trainingSessions !== undefined && trainingSessions.length > 0

  if (hasTrainingSessions && hasAscents)
    return (
      <>
        <Suspense fallback='Loading...'>
          <TrainingPopoverDescription trainingSessions={trainingSessions} />
        </Suspense>
        <br />
        <hr />
        <br />
        <Suspense fallback='Loading...'>
          <AscentsPopoverDescription ascents={ascents} />
        </Suspense>
      </>
    )

  if (hasAscents)
    return (
      <Suspense fallback='Loading...'>
        <AscentsPopoverDescription ascents={ascents} />
      </Suspense>
    )

  if (hasTrainingSessions)
    return (
      <Suspense fallback='Loading...'>
        <TrainingPopoverDescription trainingSessions={trainingSessions} />
      </Suspense>
    )

  return ''
}

const getAdjustedBackgroundColor = ({
  backgroundColor,
  date,
}: {
  backgroundColor?: string
  date: string
}): CSSProperties['backgroundColor'] => {
  if (backgroundColor !== undefined && backgroundColor !== '') return backgroundColor

  const day = new Date(date).getDay()
  const isWeekend = day === 0 || day === SATURDAY_DAY_NUMBER

  if (date === '') return 'transparent'
  if (isWeekend) return 'var(--surface-3)'

  return undefined
}

const getOutlineForToday = (date: string): CSSProperties['outline'] => {
  if (date === '') return

  if (datesEqual(new Date(date), new Date())) return '2px solid var(--text-1)'

  return undefined
}

type YearGridCellProps = Omit<DayDescriptor, 'shortText' | 'title'> & {
  formattedDate: string
  shortText?: ReactNode
  title?: ReactNode
  year: number
}
