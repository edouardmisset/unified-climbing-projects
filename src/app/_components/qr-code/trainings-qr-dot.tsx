import { memo, useMemo } from 'react'
import { prettyLongDate } from '~/helpers/formatters'
import { fromSessionTypeToClassName } from '~/helpers/training-converter'
import type { TrainingSession } from '~/schema/training'
import { Popover } from '../popover/popover'
import { TrainingPopoverDescription } from '../training-popover-description/training-popover-description'

export const TrainingsQRDot = memo(
  ({ trainingSessions }: { trainingSessions: TrainingSession[] }) => {
    const [firstSession] = trainingSessions

    const sessionClassName = useMemo(
      () =>
        firstSession?.sessionType === undefined
          ? ''
          : fromSessionTypeToClassName(firstSession.sessionType),
      [firstSession?.sessionType],
    )
    const formattedDate = useMemo(
      () =>
        firstSession?.date === undefined
          ? ''
          : prettyLongDate(firstSession.date),
      [firstSession?.date],
    )

    if (trainingSessions.length === 0 || firstSession === undefined)
      return <span />

    return (
      <Popover
        popoverDescription={
          <TrainingPopoverDescription trainingSessions={trainingSessions} />
        }
        popoverTitle={formattedDate}
        triggerClassName={sessionClassName}
        triggerContent=""
      />
    )
  },
)
