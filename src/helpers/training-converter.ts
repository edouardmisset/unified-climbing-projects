import {
  TRAINING_SESSION_TYPE_TO_BACKGROUND_COLOR,
  TRAINING_SESSION_TYPE_TO_CLASS_NAME,
  TRAINING_SESSION_TYPE_TO_STRING,
} from '~/constants/training'
import type { TrainingSession } from '~/schema/training'

/**
 * Converts a training session type to its corresponding background color.
 *
 * If sessionType is undefined, returns a default surface color.
 * Otherwise, returns the string representation of the background color associated with the training session type.
 *
 * @param {TrainingSession['sessionType']} sessionType - The type of the training session.
 * @returns {string} The background color as a string.
 */
export function fromSessionTypeToBackgroundColor(
  sessionType: TrainingSession['sessionType'],
): string {
  return sessionType === undefined
    ? 'var(--surface-1)'
    : TRAINING_SESSION_TYPE_TO_BACKGROUND_COLOR[sessionType].toString()
}

/**
 * Converts a training session type to its corresponding class name.
 *
 * If sessionType is undefined, returns undefined.
 * Otherwise, returns the pre-defined class name associated with the given
 * session type.
 *
 * @param {TrainingSession['sessionType']} sessionType - The type of the
 * training session.
 * @returns {string | undefined} The corresponding class name if sessionType is
 * defined; otherwise, undefined.
 */
export function fromSessionTypeToClassName(
  sessionType: TrainingSession['sessionType'],
): string | undefined {
  return sessionType === undefined
    ? undefined
    : TRAINING_SESSION_TYPE_TO_CLASS_NAME[sessionType]
}

/**
 * Converts a training session type to its corresponding string.
 *
 * If sessionType is undefined, the function returns undefined.
 * Otherwise, it maps the session type to the pre-defined string representation.
 *
 * @param {TrainingSession['sessionType']} sessionType - The type of the
 * training session.
 * @returns {string | undefined} The corresponding string value if sessionType
 * is defined, or undefined.
 */
function fromSessionTypeToString(
  sessionType: TrainingSession['sessionType'],
): string | undefined {
  return sessionType === undefined
    ? undefined
    : TRAINING_SESSION_TYPE_TO_STRING[sessionType]
}

/**
 * Returns an object with backgroundColor and foreColor based on session type,
 * intensityPercent, and volumePercent thresholds.
 *
 * @param {Object} params - The parameters object
 * @param {TrainingSession['sessionType']} params.sessionType - The type of the training session
 * @param {number} [params.intensityPercent=65] - The current intensity percentage
 * @param {number} [params.volumePercent=65] - The current volume percentage
 * @returns {{ backgroundColor: string; foreColor: string }} The resulting color configuration
 */
export function getSessionTypeColors({
  sessionType,
  intensityPercent = 65,
  volumePercent = 65,
}: {
  sessionType: TrainingSession['sessionType']
  intensityPercent?: number
  volumePercent?: number
}): string {
  if (sessionType === undefined) return 'var(--cell-color)'

  const upperThreshold = 80
  const lowerThreshold = 50

  const isOneComponentAboveThreshold =
    intensityPercent >= upperThreshold || volumePercent >= upperThreshold

  const isOneComponentBelowThreshold =
    intensityPercent <= lowerThreshold || volumePercent <= lowerThreshold

  const convertedSessionType =
    fromSessionTypeToString(sessionType) ?? 'other-training'
  if (isOneComponentBelowThreshold) {
    return `var(--${convertedSessionType}-low)`
  }

  if (isOneComponentAboveThreshold) {
    return `var(--${convertedSessionType}-high)`
  }

  return `var(--${convertedSessionType})`
}
