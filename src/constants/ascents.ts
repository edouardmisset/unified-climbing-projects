import Color from 'colorjs.io'
import type { Ascent, Grade } from '~/schema/ascent'

export const ASCENT_STYLE_TO_COLOR: Record<Ascent['style'], string> = {
  Onsight: 'var(--green-4)',
  Flash: 'var(--yellow-4)',
  Redpoint: 'var(--red-4)',
} as const

export const CLIMBING_DISCIPLINE_TO_COLOR: Record<
  Ascent['climbingDiscipline'],
  string
> = {
  'Multi-Pitch': 'var(--choco-5)',
  Boulder: 'var(--red-5)',
  Route: 'var(--blue-5)',
} as const

const ascentLightness = '1'
const ascentChroma = '0.15'

const color7a = new Color(`oklch(${ascentLightness} ${ascentChroma} 135)`)
const color8a = new Color(`oklch(${ascentLightness} ${ascentChroma} 220)`)

const darkeningCoefficient = 0.1

export const ASCENT_GRADE_TO_COLOR: Partial<Record<Grade, string>> = {
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
