import Color from 'colorjs.io'
import type { TrainingSession } from '~/types/training'

import { z } from 'zod'

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
  Out: outdoorColor,

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

export const getTrainingSessionColorVariant = (
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

export const convertSessionTypeToForeColor = (
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

const ASCENT_GRADE_TO_COLOR: Partial<Record<Grade, string>> = {
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
  '8c': new Color(color8a.darken(4 * darkeningCoefficient)).toString(),
  '8c+': new Color(color8a.darken(5 * darkeningCoefficient)).toString(),
}

export const convertGradeToBackgroundColor = (
  grade: Grade | undefined,
): string =>
  grade === undefined ? 'black' : (ASCENT_GRADE_TO_COLOR[grade] ?? 'black')

const degrees = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const
const degreeSchema = z.enum(degrees)

type Degree = z.infer<typeof degreeSchema>

const ROUTE_LETTERS = ['a', 'b', 'c'] as const
const routeGradeLetterSchema = z.enum(ROUTE_LETTERS)

type RouteGradeLetter = z.infer<typeof routeGradeLetterSchema>

const optionalPlus = ['', '+'] as const
const optionalPlusSchema = z.enum(optionalPlus)
type OptionalPlus = z.infer<typeof optionalPlusSchema>

export type RouteGrade = `${Degree}${RouteGradeLetter}${OptionalPlus}`
type Grade = RouteGrade

interface CreateFrenchGradingScaleParams {
  minDegree: number
  maxDegree: number
}

const createFrenchGradingScale = <GradeType extends Grade>(
  params: CreateFrenchGradingScaleParams,
) => {
  const { minDegree, maxDegree } = params

  if (minDegree > maxDegree) throw new Error('Min cannot be greater than max')

  const min = degreeSchema.parse(minDegree.toString())
  const max = degreeSchema.parse(maxDegree.toString())

  const scale = Array.from({ length: Number(max) - Number(min) + 1 }, (_, i) =>
    degreeSchema.parse((i + Number(min)).toString()),
  )

  return scale.flatMap(degree =>
    ROUTE_LETTERS.map(letter => degree + letter).flatMap(degreeAndLetter =>
      optionalPlus.map(maybePlus => (degreeAndLetter + maybePlus) as GradeType),
    ),
  )
}

const ROUTE_GRADES = createFrenchGradingScale<RouteGrade>({
  minDegree: 4,
  maxDegree: 9,
})

const createGradeToNumberMap = <GradeType extends Grade>(
  grades: GradeType[],
): Map<GradeType, number> =>
  new Map(grades.map((grade, index) => [grade, index + 1]))

const invertMapKeyValue = <GradeType extends Grade, Value extends number>(
  map: Map<GradeType, Value>,
): Map<Value, GradeType> =>
  new Map([...map].map<[Value, GradeType]>(([grade, value]) => [value, grade]))

export const ROUTE_GRADE_TO_NUMBER = createGradeToNumberMap(ROUTE_GRADES)

export const NUMBER_TO_ROUTE_GRADE = invertMapKeyValue(ROUTE_GRADE_TO_NUMBER)

export const convertGradeToNumber = <GradeType extends Grade>(
  grade: GradeType,
): number => ROUTE_GRADE_TO_NUMBER.get(grade as RouteGrade) ?? 0

export const convertNumberToGrade = (gradeNumber: number): Grade =>
  NUMBER_TO_ROUTE_GRADE.get(gradeNumber) ?? '1a'
