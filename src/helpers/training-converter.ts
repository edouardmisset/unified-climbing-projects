import { average } from '@edouardmisset/math'
import { SESSION_TYPE, type TrainingSession } from '~/schema/training'

/**
 * Returns an object with backgroundColor and foreColor based on session type,
 * intensityPercent, and volumePercent thresholds.
 *
 * @param {Object} params - The parameters object
 * @param {TrainingSession['type']} params.sessionType - The type of the training session
 * @param {number} [params.intensityPercent=65] - The current intensity percentage
 * @param {number} [params.volumePercent=65] - The current volume percentage
 * @returns {{ backgroundColor: string; foreColor: string }} The resulting color configuration
 */
export function getSessionColor({
  sessionType,
  intensityPercent = 65,
  volumePercent = 65,
}: {
  sessionType: TrainingSession['type']
  intensityPercent?: number
  volumePercent?: number
}): string {
  if (sessionType === undefined) return 'var(--cellColor)'

  const upperThreshold = 80
  const lowerThreshold = 30

  const averageUpperThreshold = 70
  const averageLowerThreshold = 50

  const mean = average(intensityPercent, volumePercent)

  const isHigh =
    upperThreshold <= intensityPercent ||
    upperThreshold <= volumePercent ||
    averageUpperThreshold <= mean

  const isLow =
    intensityPercent <= lowerThreshold ||
    volumePercent <= lowerThreshold ||
    mean <= averageLowerThreshold

  const convertedSessionType =
    SESSION_TYPE[sessionType].category ?? 'otherTraining'

  if (isLow && isHigh) return `var(--${convertedSessionType})`
  if (isLow) return `var(--${convertedSessionType}Low)`
  if (isHigh) return `var(--${convertedSessionType}High)`
  return `var(--${convertedSessionType})`
}
