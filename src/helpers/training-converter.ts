import {
  DEFAULT_INTENSITY_PERCENT,
  DEFAULT_VOLUME_PERCENT,
  TRAINING_SESSION_TYPE_TO_BACKGROUND_COLOR,
  TRAINING_SESSION_TYPE_TO_CLASS_NAME,
  TRAINING_SESSION_TYPE_TO_STRING,
} from '~/constants/training'
import type { TrainingSession } from '~/schema/training'

/**
 * Converts a training session type to its corresponding background color.
 *
 * If type is undefined, returns a default surface color.
 * Otherwise, returns the string representation of the background color associated with the training session type.
 *
 * @param {TrainingSession['type']} type - The type of the training session.
 * @returns {string} The background color as a string.
 */
export function fromSessionTypeToBackgroundColor(
  type: TrainingSession['type'] | undefined,
): string {
  return type === undefined ? 'var(--surface-1)' : TRAINING_SESSION_TYPE_TO_BACKGROUND_COLOR[type]
}

/**
 * Converts a training session type to its corresponding class name.
 *
 * If type is undefined, returns undefined.
 * Otherwise, returns the pre-defined class name associated with the given
 * session type.
 *
 * @param {TrainingSession['type']} type - The type of the
 * training session.
 * @returns {string | undefined} The corresponding class name if type is
 * defined; otherwise, undefined.
 */
export function fromSessionTypeToClassName(
  type: TrainingSession['type'] | undefined,
): string | undefined {
  return type === undefined ? undefined : TRAINING_SESSION_TYPE_TO_CLASS_NAME[type]
}

/**
 * Converts a training session type to its corresponding string.
 *
 * If type is undefined, the function returns undefined.
 * Otherwise, it maps the session type to the pre-defined string representation.
 *
 * @param {TrainingSession['type']} type - The type of the
 * training session.
 * @returns {string | undefined} The corresponding string value if type
 * is defined, or undefined.
 */
function fromSessionTypeToString(type: TrainingSession['type'] | undefined): string | undefined {
  return type === undefined ? undefined : TRAINING_SESSION_TYPE_TO_STRING[type]
}

/**
 * Returns an object with backgroundColor and foreColor based on session type,
 * intensityPercent, and volumePercent thresholds.
 *
 * @param {Object} params - The parameters object
 * @param {TrainingSession['type']} params.type - The type of the training session
 * @param {number} [params.intensityPercent=DEFAULT_INTENSITY_PERCENT] - The current intensity percentage
 * @param {number} [params.volumePercent=DEFAULT_VOLUME_PERCENT] - The current volume percentage
 * @returns {{ backgroundColor: string; foreColor: string }} The resulting color configuration
 */
export function getSessionTypeColors({
  type,
  intensityPercent = DEFAULT_INTENSITY_PERCENT,
  volumePercent = DEFAULT_VOLUME_PERCENT,
}: {
  type: TrainingSession['type'] | undefined
  intensityPercent?: number
  volumePercent?: number
}): string {
  if (type === undefined) return 'var(--cellColor)'

  const upperThreshold = 80
  const lowerThreshold = 50

  const isOneComponentAboveThreshold =
    intensityPercent >= upperThreshold || volumePercent >= upperThreshold

  const isOneComponentBelowThreshold =
    intensityPercent <= lowerThreshold || volumePercent <= lowerThreshold

  const convertedSessionType = fromSessionTypeToString(type) ?? 'otherTraining'
  if (isOneComponentBelowThreshold) return `var(--${convertedSessionType}Low)`

  if (isOneComponentAboveThreshold) return `var(--${convertedSessionType}High)`

  return `var(--${convertedSessionType})`
}
