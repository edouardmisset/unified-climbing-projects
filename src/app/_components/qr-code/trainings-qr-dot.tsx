import { memo, useMemo } from 'react'
import { prettyLongDate } from '~/helpers/formatters'
import { fromSessionTypeToClassName } from '~/helpers/training-converter'
import type { TrainingSession } from '~/schema/training'
import { Popover } from '../popover/popover'
import { TrainingPopoverDescription } from '../training-popover-description/training-popover-description'

// TODO: this component can now take multiple sessions. We should aggregate the
// sessions and display a tooltip showing all the sessions and the className
// should take an average ? max ? of the session types and load ?
export const TrainingsQRDot = memo(
  ({ trainingSessions }: { trainingSessions: TrainingSession[] }) => {
    const [firstSession] = trainingSessions
    if (
      trainingSessions === undefined ||
      trainingSessions.length === 0 ||
      firstSession === undefined
    )
      return <span />

    const sessionClassName = useMemo(
      () =>
        firstSession?.sessionType === undefined
          ? ''
          : fromSessionTypeToClassName(firstSession.sessionType),
      [firstSession.sessionType],
    )
    const formattedDate = useMemo(
      () => prettyLongDate(firstSession.date),
      [firstSession.date],
    )
    return (
      <Popover
        triggerClassName={sessionClassName}
        popoverDescription={
          <TrainingPopoverDescription trainingSessions={trainingSessions} />
        }
        popoverTitle={formattedDate}
        triggerContent=""
      />
    )
  },
)
