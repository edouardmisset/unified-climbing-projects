import { assert, describe, it } from 'poku'
import type { Ascent } from '~/schema/ascent'
import { formatGrade } from './format-grade'

describe('formatGrade', () => {
  const BOULDER_TEST_CASES = [
    { input: '7a', expected: '7A' },
    { input: '5c', expected: '5C' },
  ] as const

  for (const { input, expected } of BOULDER_TEST_CASES) {
    it(`should return uppercase grade for Bouldering (${input} -> ${expected})`, () => {
      const ascentDetails = {
        climbingDiscipline: 'Boulder',
        topoGrade: input,
      } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
      assert.strictEqual(
        formatGrade({
          climbingDiscipline: ascentDetails.climbingDiscipline,
          grade: ascentDetails.topoGrade,
        }),
        expected,
      )
    })
  }

  const ROUTE_TEST_CASES = [
    { input: '7a', expected: '7a' },
    { input: '6b+', expected: '6b+' },
    { input: '8a', expected: '8a' },
  ] as const

  for (const { input, expected } of ROUTE_TEST_CASES) {
    it(`should return grade as is for Route (${input} -> ${expected})`, () => {
      const ascentDetails = {
        climbingDiscipline: 'Route',
        topoGrade: input,
      } as const satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
      assert.strictEqual(
        formatGrade({
          climbingDiscipline: ascentDetails.climbingDiscipline,
          grade: ascentDetails.topoGrade,
        }),
        expected,
      )
    })
  }

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
