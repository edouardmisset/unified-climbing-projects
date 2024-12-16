import { convertSessionTypeToBackgroundColor } from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import { parseISODateToTemporal } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'

export function trainingSessionsQRCodeRender(trainingSession: TrainingSession) {
  return (
    <i
      key={
        parseISODateToTemporal(trainingSession.date).dayOfYear.toString() +
        trainingSession.date
      }
      style={{
        backgroundColor: convertSessionTypeToBackgroundColor(
          trainingSession.sessionType,
        ).toString(),
      }}
      title={createTrainingQRTooltip(trainingSession)}
    />
  )
}
