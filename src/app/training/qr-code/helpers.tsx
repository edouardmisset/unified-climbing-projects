import { fromSessionTypeToBackgroundColor } from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import type { TrainingSession } from '~/schema/training'

export function trainingSessionsQRCodeRender(trainingSession: TrainingSession) {
  return (
    <i
      key={trainingSession.date}
      style={{
        backgroundColor: fromSessionTypeToBackgroundColor(
          trainingSession.sessionType,
        ).toString(),
      }}
      title={createTrainingQRTooltip(trainingSession)}
    />
  )
}
