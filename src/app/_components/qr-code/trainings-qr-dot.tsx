import { lazy, memo, Suspense, useMemo } from 'react'
import { prettyLongDate } from '~/helpers/formatters'
import { fromSessionTypeToClassName } from '~/helpers/training-converter'
import type { TrainingSession } from '~/schema/training'
import { Popover } from '../popover/popover'

// Lazy load the popover component
const TrainingPopoverDescription = lazy(async () =>
  import('../training-popover-description/training-popover-description').then(module => ({
    default: module.TrainingPopoverDescription,
  })),
)

export const TrainingsQRDot = memo(
  ({ trainingSessions }: { trainingSessions: TrainingSession[] }) => {
    const [firstSession] = trainingSessions

    const sessionClassName =
      firstSession?.sessionType === undefined
        ? ''
        : fromSessionTypeToClassName(firstSession.sessionType)
    const formattedDate = firstSession?.date === undefined ? '' : prettyLongDate(firstSession.date)

    // LAZY LOADING: Create description component only when needed
    const lazyDescription = useMemo(() => {
      if (trainingSessions.length === 0) return ''
      return (
        <Suspense fallback='Loading...'>
          <TrainingPopoverDescription trainingSessions={trainingSessions} />
        </Suspense>
      )
    }, [trainingSessions])

    if (trainingSessions.length === 0 || firstSession === undefined) return <span />

    return (
      <Popover
        popoverDescription={lazyDescription}
        popoverTitle={formattedDate}
        triggerClassName={sessionClassName}
        triggerContent=''
      />
    )
  },
)
