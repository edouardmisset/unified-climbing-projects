import type { Ascent, Grade } from '~/schema/ascent'

export const ASCENT_STYLE_TO_COLOR: Record<Ascent['style'], string> = {
  Onsight: 'var(--onsight)',
  Flash: 'var(--flash)',
  Redpoint: 'var(--redpoint)',
} as const

export const CLIMBING_DISCIPLINE_TO_COLOR: Record<
  Ascent['climbingDiscipline'],
  string
> = {
  'Multi-Pitch': 'var(--multi-pitch)',
  Boulder: 'var(--boulder)',
  Route: 'var(--route)',
} as const

/**
 * This is a mapping from ascent grades to colors.
 * It returns the color associated with the grade as a css variable.
 *
 * NB: See styles/grades.css for the color definitions.
 */
export const ASCENT_GRADE_TO_COLOR: Partial<Record<Grade, string>> = {
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
}

export const DEFAULT_BOULDER_HEIGHT = 2
