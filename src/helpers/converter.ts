import { ASCENT_GRADE_TO_COLOR } from '~/constants/ascents'
import {
  SESSION_TYPE_TO_BACKGROUND_COLOR,
  SESSION_TYPE_TO_CLASS_NAME,
} from '~/constants/training'
import type { Ascent, Grade } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'

export function fromSessionTypeToBackgroundColor(
  sessionType: TrainingSession['sessionType'],
): string {
  return sessionType === undefined
    ? 'var(--surface-1)'
    : SESSION_TYPE_TO_BACKGROUND_COLOR[sessionType].toString()
}

export function fromSessionTypeToClassName(
  sessionType: TrainingSession['sessionType'],
): string | undefined {
  return sessionType === undefined
    ? undefined
    : SESSION_TYPE_TO_CLASS_NAME[sessionType]
}

const TRAINING_SESSION_TYPE_TO_STRING = {
  Out: 'outdoor',
  Ta: 'tapered',
  Co: 'other-training',
  FB: 'other-training',
  Ro: 'other-training',
  Sg: 'other-training',
  CS: 'strength',
  Po: 'strength',
  MS: 'strength',
  En: 'endurance',
  PE: 'endurance',
  SE: 'endurance',
  Sk: 'stamina',
  St: 'stamina',
} as const satisfies Record<NonNullable<TrainingSession['sessionType']>, string>

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

export function fromGradeToBackgroundColor(grade: Grade | undefined): string {
  return grade === undefined
    ? 'black'
    : (ASCENT_GRADE_TO_COLOR[grade] ?? 'black')
}

export function fromGradeToClassName(
  grade?: Ascent['topoGrade'],
): string | undefined {
  return grade && `_${grade.replaceAll('+', '_')}`
}
