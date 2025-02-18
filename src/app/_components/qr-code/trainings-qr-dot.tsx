import { fromSessionTypeToClassName } from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'

// TODO: this component can now take multiple sessions. We should aggregate the
// sessions and display a tooltip showing all the sessions and the className
// should take an average ? max ? of the session types and load ?
export function TrainingsQRDot({
  trainingSessions,
}: { trainingSessions: TrainingSession[] }) {
  if (
    trainingSessions === undefined ||
    trainingSessions.length === 0 ||
    trainingSessions[0] === undefined
  )
    return <span />

  return (
    <span
      className={fromSessionTypeToClassName(trainingSessions[0].sessionType)}
      title={createTrainingQRTooltip(trainingSessions[0])}
    />
  )
}
