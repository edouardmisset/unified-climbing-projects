import Color from 'colorjs.io'
import { ASCENT_GRADE_TO_COLOR } from '~/constants/ascents'
import { SESSION_TYPE_TO_BACKGROUND_COLOR } from '~/constants/training'
import type { Grade } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'

export const fromSessionTypeToBackgroundColor = (
  sessionType: TrainingSession['sessionType'],
): Color =>
  sessionType === undefined
    ? new Color('white')
    : SESSION_TYPE_TO_BACKGROUND_COLOR[sessionType]

export const getTrainingSessionColorVariant = ({
  color,
  intensityPercent,
  volumePercent,
}: {
  color: Color
  intensityPercent: number
  volumePercent: number
}): Color => {
  const upperThreshold = 80
  const lowerThreshold = 50

  const isOneComponentAboveThreshold =
    intensityPercent >= upperThreshold || volumePercent >= upperThreshold

  const isOneComponentBelowThreshold =
    intensityPercent <= lowerThreshold || volumePercent <= lowerThreshold

  const maximumLightness = 0.9
  const minimumLightness = 0.6
  const defaultLightness = 0.75

  const lightness = isOneComponentBelowThreshold
    ? maximumLightness
    : isOneComponentAboveThreshold
      ? minimumLightness
      : defaultLightness

  return new Color(
    new Color(color).set({
      l: l => (l === 0 ? 0 : lightness),
    }),
  )
}

export const fromSessionTypeToForeColor = (
  sessionType: TrainingSession['sessionType'],
): Color =>
  new Color(
    sessionType === undefined
      ? 'transparent'
      : new Color(SESSION_TYPE_TO_BACKGROUND_COLOR[sessionType]).darken(0.2),
  )

export const fromGradeToBackgroundColor = (grade: Grade | undefined): string =>
  grade === undefined ? 'black' : (ASCENT_GRADE_TO_COLOR[grade] ?? 'black')
