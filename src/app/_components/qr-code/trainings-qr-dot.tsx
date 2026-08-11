import { lazy, Suspense } from 'react'
import { prettyLongDate } from '~/helpers/formatters'
import { fromSessionTypeToClassName } from '~/helpers/training-converter'
import type { TrainingSession } from '~/schema/training'
import { Popover } from '../ui/popover/popover'

// Lazy load the popover component
const TrainingPopoverDescription = lazy(async () =>
  import('../training-popover-description/training-popover-description').then(module => ({
    default: module.TrainingPopoverDescription,
  })),
)

export const TrainingsQRDot = ({ trainingSessions }: { trainingSessions: TrainingSession[] }) => {
  const [firstSession] = trainingSessions

  const sessionClassName =
    firstSession?.type === undefined ? '' : fromSessionTypeToClassName(firstSession.type)
  const formattedDate = firstSession?.date === undefined ? '' : prettyLongDate(firstSession.date)

  if (trainingSessions.length === 0 || firstSession === undefined) return <span />

  const lazyDescription = (
    <Suspense fallback='Loading...'>
      <TrainingPopoverDescription trainingSessions={trainingSessions} />
    </Suspense>
  )

  return (
    <Popover
      aria-label={`Training on ${formattedDate}`}
      className={sessionClassName}
      popoverTitle={formattedDate}
      showOnInterest
      trigger=''
    >
      {lazyDescription}
    </Popover>
  )
}
