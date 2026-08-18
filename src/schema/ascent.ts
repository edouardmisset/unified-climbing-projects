import type { AscentRecord } from '~/domain/ascent'

export {
  ASCENT_GRADES as GRADES,
  ASCENT_HOLDS as HOLDS,
  ASCENT_PROFILES as PROFILES,
  ASCENT_STYLES as ASCENT_STYLE,
  ascentGradeSchema as gradeSchema,
  ascentHoldsSchema as holdsSchema,
  ascentProfileSchema as profileSchema,
  ascentStyleSchema,
} from '~/domain/ascent'

export const GRADE_TO_NUMBER = {
  '1a': 1,
  '1a+': 2,
  '1b': 3,
  '1b+': 4,
  '1c': 5,
  '1c+': 6,

  '2a': 7,
  '2a+': 8,
  '2b': 9,
  '2b+': 10,
  '2c': 11,
  '2c+': 12,

  '3a': 13,
  '3a+': 14,
  '3b': 15,
  '3b+': 16,
  '3c': 17,
  '3c+': 18,

  '4a': 19,
  '4a+': 20,
  '4b': 21,
  '4b+': 22,
  '4c': 23,
  '4c+': 24,

  '5a': 25,
  '5a+': 26,
  '5b': 27,
  '5b+': 28,
  '5c': 29,
  '5c+': 30,

  '6a': 31,
  '6a+': 32,
  '6b': 33,
  '6b+': 34,
  '6c': 35,
  '6c+': 36,

  '7a': 37,
  '7a+': 38,
  '7b': 39,
  '7b+': 40,
  '7c': 41,
  '7c+': 42,

  '8a': 43,
  '8a+': 44,
  '8b': 45,
  '8b+': 46,
  '8c': 47,
  '8c+': 48,

  '9a': 49,
  '9a+': 50,
  '9b': 51,
  '9b+': 52,
  '9c': 53,
  '9c+': 54,
} as const satisfies Record<Grade, number>

export const GRADE_TO_POINTS = {
  '5a': 100,
  '5a+': 150,
  '5b': 200,
  '5b+': 250,
  '5c': 300,
  '5c+': 350,

  '6a': 400,
  '6a+': 450,
  '6b': 500,
  '6b+': 550,
  '6c': 600,
  '6c+': 650,

  '7a': 700,
  '7a+': 750,
  '7b': 800,
  '7b+': 850,
  '7c': 900,
  '7c+': 950,

  '8a': 1_000,
  '8a+': 1_050,
  '8b': 1_100,
  '8b+': 1_150,
  '8c': 1_200,
  '8c+': 1_250,

  '9a': 1_300,
  '9a+': 1_350,
  '9b': 1_400,
  '9b+': 1_450,
  '9c': 1_500,
  '9c+': 1_550,
} as const satisfies Partial<Record<Grade, number>>

export const STYLE_TO_POINTS = {
  Flash: 50,
  Onsight: 150,
  Redpoint: 0,
} as const satisfies Record<Ascent['style'], number>

export const BOULDERING_BONUS_POINTS = 100 as const

export type Grade = AscentRecord['grade']

export type Ascent = AscentRecord

export type AscentListProps = {
  ascents: Ascent[]
}
