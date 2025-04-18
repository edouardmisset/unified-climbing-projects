import type { Ascent, Grade } from '~/schema/ascent'

export const ASCENT_STYLE_TO_COLOR = {
  Onsight: 'var(--onsight)',
  Flash: 'var(--flash)',
  Redpoint: 'var(--redpoint)',
} as const satisfies Record<Ascent['style'], string>

export const CLIMBING_DISCIPLINE_TO_COLOR = {
  'Multi-Pitch': 'var(--multi-pitch)',
  Boulder: 'var(--boulder)',
  Route: 'var(--route)',
} as const satisfies Record<Ascent['climbingDiscipline'], string>

/**
 * This is a mapping from ascent grades to colors.
 * It returns the color associated with the grade as a css variable.
 *
 * NB: See styles/grades.css for the color definitions.
 */
export const ASCENT_GRADE_TO_COLOR = {
  '6a': 'var(--6a)',
  '6a+': 'var(--6a_)',
  '6b': 'var(--6b)',
  '6b+': 'var(--6b_)',
  '6c': 'var(--6c)',
  '6c+': 'var(--6c_)',

  '7a': 'var(--7a)',
  '7a+': 'var(--7a_)',
  '7b': 'var(--7b)',
  '7b+': 'var(--7b_)',
  '7c': 'var(--7c)',
  '7c+': 'var(--7c_)',

  '8a': 'var(--8a)',
  '8a+': 'var(--8a_)',
  '8b': 'var(--8b)',
  '8b+': 'var(--8b_)',
  '8c': 'var(--8c)',
  '8c+': 'var(--8c_)',
} as const satisfies Partial<Record<Grade, string>>

export const DEFAULT_BOULDER_HEIGHT = 2 as const

export const DEFAULT_GRADE = '1a' as const satisfies Grade

// COEFFICIENTS
export const COEF_ONSIGHT_FLASH_RATIO = 0.2 as const
export const COEF_TRIES_PER_ASCENT = 0.2 as const
export const COEF_ASCENTS_PER_DAY = 0.05 as const
export const COEF_ASCENT_DAY_PER_DAY_OUTSIDE = 0.1 as const
export const COEF_TOP_TEN = 0.0001 as const
export const COEF_VOLUME = 0.01 as const
export const COEF_NUMBER_OF_CRAGS = 15 as const
export const MAX_DISCRETE_HEIGHT_COUNT = 10 as const
