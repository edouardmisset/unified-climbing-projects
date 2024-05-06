import { GRADE_TO_NUMBER, type Grade } from '~/types/ascent'
import { type TrainingSession } from '~/types/training'
import Color from 'colorjs.io'

export const convertAscentGradeToNumber = (grade: Grade): number =>
  GRADE_TO_NUMBER[grade]

const lightness = '0.7'
const chroma = '0.15'

const staminaColor = new Color(`oklch(${lightness} ${chroma} 260)`)
const taperedColor = new Color(`oklch(${lightness} ${chroma} 295)`)
const enduranceColor = new Color(`oklch(${lightness} ${chroma} 70)`)
const strengthColor = new Color(`oklch(${lightness} ${chroma} 20)`)
const outdoorColor = new Color(`oklch(${lightness} ${chroma} 130)`)
const otherTrainingColor = new Color(`oklch(${lightness} 0 0)`)

const SESSION_TYPE_TO_BACKGROUND_COLOR: Record<
  Exclude<TrainingSession['sessionType'], undefined>,
  Color
> = {
  Ex: outdoorColor,

  Ta: taperedColor,

  Co: otherTrainingColor,
  FB: otherTrainingColor,
  Ro: otherTrainingColor,
  Sg: otherTrainingColor,

  CS: strengthColor,
  Po: strengthColor,
  MS: strengthColor,

  En: enduranceColor,
  PE: enduranceColor,
  SE: enduranceColor,

  Sk: staminaColor,
  St: staminaColor,
}

export const convertSessionTypeToBackgroundColor = (
  sessionType: TrainingSession['sessionType'],
): Color =>
  sessionType === undefined
    ? new Color('white')
    : SESSION_TYPE_TO_BACKGROUND_COLOR[sessionType]

export const getColorVariant = (
  color: Color,
  intensityPercent: number,
  volumePercent: number,
): Color => {
  const upperThreshold = 80
  const lowerThreshold = 50

  const isOneComponentAboveThreshold =
    intensityPercent >= upperThreshold || volumePercent >= upperThreshold

  const isOneComponentBelowThreshold =
    intensityPercent <= lowerThreshold || volumePercent <= lowerThreshold

  const lightness = isOneComponentBelowThreshold
    ? 0.9
    : isOneComponentAboveThreshold
    ? 0.6
    : 0.75

  return new Color(
    new Color(color).set({
      l: l => (l === 0 ? 0 : lightness),
    }),
  )
}

export const convertSessionTypeToAccentColor = (
  sessionType: TrainingSession['sessionType'],
): Color =>
  new Color(
    sessionType === undefined
      ? 'transparent'
      : new Color(SESSION_TYPE_TO_BACKGROUND_COLOR[sessionType]).darken(0.2),
  )

const ascentLightness = '1'
const ascentChroma = '0.15'

const color7a = new Color(`oklch(${ascentLightness} ${ascentChroma} 135)`)
const color8a = new Color(`oklch(${ascentLightness} ${ascentChroma} 220)`)

const darkeningCoefficient = 0.1

const ASCENT_GRADE_TO_COLOR: Record<Grade, string> = {
  '6c': 'red',
  '6c+': 'red',
  '7a': color7a.toString(),
  '7a+': new Color(color7a.darken(1 * darkeningCoefficient)).toString(),
  '7b': new Color(color7a.darken(2 * darkeningCoefficient)).toString(),
  '7b+': new Color(color7a.darken(3 * darkeningCoefficient)).toString(),
  '7c': new Color(color7a.darken(4 * darkeningCoefficient)).toString(),
  '7c+': new Color(color7a.darken(5 * darkeningCoefficient)).toString(),
  '8a': color8a.toString(),
  '8a+': new Color(color8a.darken(1 * darkeningCoefficient)).toString(),
  '8b': new Color(color8a.darken(2 * darkeningCoefficient)).toString(),
  '8b+': new Color(color8a.darken(3 * darkeningCoefficient)).toString(),
}

export const convertGradeToColor = (grade: Grade): string =>
  ASCENT_GRADE_TO_COLOR[grade] ?? 'black'
