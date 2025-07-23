import { assert, describe, it } from 'poku'
import type { Ascent } from '~/schema/ascent'
import { formatGrade } from './format-grade'

describe('displayGrade', () => {
  it('should return uppercase grade for Bouldering (e.g., 7a -> 7A)', () => {
    const ascentDetails = {
      climbingDiscipline: 'Boulder',
      topoGrade: '7a',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
    assert.strictEqual(
      formatGrade({
        climbingDiscipline: ascentDetails.climbingDiscipline,
        grade: ascentDetails.topoGrade,
      }),
      '7A',
    )
  })

  it('should return uppercase grade for Bouldering (e.g., 5c -> 5C)', () => {
    const ascentDetails = {
      climbingDiscipline: 'Boulder',
      topoGrade: '5c',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
    assert.strictEqual(
      formatGrade({
        climbingDiscipline: ascentDetails.climbingDiscipline,
        grade: ascentDetails.topoGrade,
      }),
      '5C',
    )
  })

  it('should return grade as is for Route (e.g., 7a -> 7a)', () => {
    const ascentDetails = {
      climbingDiscipline: 'Route',
      topoGrade: '7a',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
    assert.strictEqual(
      formatGrade({
        climbingDiscipline: ascentDetails.climbingDiscipline,
        grade: ascentDetails.topoGrade,
      }),
      '7a',
    )
  })

  it('should return grade as is for Route (e.g., 6b+ -> 6b+)', () => {
    const ascentDetails = {
      climbingDiscipline: 'Route',
      topoGrade: '6b+',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
    assert.strictEqual(
      formatGrade({
        climbingDiscipline: ascentDetails.climbingDiscipline,
        grade: ascentDetails.topoGrade,
      }),
      '6b+',
    )
  })

  it('should return grade as is for Multi-Pitch (e.g., 8a -> 8a)', () => {
    const ascentDetails = {
      climbingDiscipline: 'Multi-Pitch',
      topoGrade: '8a',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
    assert.strictEqual(
      formatGrade({
        climbingDiscipline: ascentDetails.climbingDiscipline,
        grade: ascentDetails.topoGrade,
      }),
      '8a',
    )
  })
})
