import { assert, describe, it } from 'poku'
import type { Ascent } from '~/schema/ascent'
import { displayGrade } from './display-grade'

describe('displayGrade', () => {
  it('should return uppercase grade for Bouldering (e.g., 7a -> 7A)', () => {
    const ascentDetails = {
      topoGrade: '7a',
      climbingDiscipline: 'Boulder',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
    assert.strictEqual(
      displayGrade({
        grade: ascentDetails.topoGrade,
        climbingDiscipline: ascentDetails.climbingDiscipline,
      }),
      '7A',
    )
  })

  it('should return uppercase grade for Bouldering (e.g., 5c -> 5C)', () => {
    const ascentDetails = {
      topoGrade: '5c',
      climbingDiscipline: 'Boulder',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
    assert.strictEqual(
      displayGrade({
        grade: ascentDetails.topoGrade,
        climbingDiscipline: ascentDetails.climbingDiscipline,
      }),
      '5C',
    )
  })

  it('should return grade as is for Route (e.g., 7a -> 7a)', () => {
    const ascentDetails = {
      topoGrade: '7a',
      climbingDiscipline: 'Route',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
    assert.strictEqual(
      displayGrade({
        grade: ascentDetails.topoGrade,
        climbingDiscipline: ascentDetails.climbingDiscipline,
      }),
      '7a',
    )
  })

  it('should return grade as is for Route (e.g., 6b+ -> 6b+)', () => {
    const ascentDetails = {
      topoGrade: '6b+',
      climbingDiscipline: 'Route',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
    assert.strictEqual(
      displayGrade({
        grade: ascentDetails.topoGrade,
        climbingDiscipline: ascentDetails.climbingDiscipline,
      }),
      '6b+',
    )
  })

  it('should return grade as is for Multi-Pitch (e.g., 8a -> 8a)', () => {
    const ascentDetails = {
      topoGrade: '8a',
      climbingDiscipline: 'Multi-Pitch',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
    assert.strictEqual(
      displayGrade({
        grade: ascentDetails.topoGrade,
        climbingDiscipline: ascentDetails.climbingDiscipline,
      }),
      '8a',
    )
  })
})
