import { fromSessionTypeToClassName } from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'

export function trainingSessionsQRCodeRender(trainingSession: TrainingSession) {
  return (
    <i
      key={trainingSession.date}
      className={fromSessionTypeToClassName(trainingSession.sessionType)}
      title={createTrainingQRTooltip(trainingSession)}
    />
  )
}
