import { GRADE_TO_NUMBER, type Grade } from '~/types/ascent'
import { type TrainingSession } from '~/types/training'
import Color from 'colorjs.io'

export const convertAscentGradeToNumber = (grade: Grade): number =>
  GRADE_TO_NUMBER[grade]

const lightness = '0.8'
const chroma = '0.1'

const staminaColor = new Color(`oklch(${lightness} ${chroma} 260)`)
const taperedColor = new Color(`oklch(${lightness} ${chroma} 295)`)
const enduranceColor = new Color(`oklch(${lightness} ${chroma} 70)`)
const strengthColor = new Color(`oklch(${lightness} ${chroma} 20)`)
const outdoorColor = new Color(`oklch(${lightness} ${chroma} 130)`)
const otherTrainingColor = new Color(`oklch(${lightness} 0 0)`)

const SESSION_TYPE_TO_BACKGROUND_COLOR: Record<
  Exclude<TrainingSession['sessionType'], undefined>,
  string
> = {
  Ex: outdoorColor.toString(),

  Ta: taperedColor.toString(),

  Co: otherTrainingColor.toString(),
  FB: otherTrainingColor.toString(),
  Ro: otherTrainingColor.toString(),
  Sg: otherTrainingColor.toString(),

  CS: strengthColor.toString(),
  Po: strengthColor.toString(),
  MS: strengthColor.toString(),

  En: enduranceColor.toString(),
  PE: enduranceColor.toString(),
  SE: enduranceColor.toString(),

  Sk: staminaColor.toString(),
  St: staminaColor.toString(),
}

export const convertSessionTypeToBackgroundColor = (
  sessionType: TrainingSession['sessionType'],
): string =>
  sessionType === undefined
    ? 'white'
    : SESSION_TYPE_TO_BACKGROUND_COLOR[sessionType]



const ascentLightness = '1'
const ascentChroma = '0.15'

const color7a = new Color(`oklch(${ascentLightness} ${ascentChroma} 135)`)
const color8a = new Color(`oklch(${ascentLightness} ${ascentChroma} 220)`)

const darkeningCoefficient = .1

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

export const convertGradeToColor = (grade: Grade): string => ASCENT_GRADE_TO_COLOR[grade] ?? 'black'