import { describe, expect, it } from 'vitest'
import { climbingDisciplineSchema, gradeSchema, type Ascent } from '~/schema/ascent'
import { formatGrade } from './format-grade'

describe('formatGrade', () => {
  const BOULDER_TEST_CASES = [
    { input: '7a', expected: '7A' },
    { input: '5c', expected: '5C' },
  ] as const

  for (const { input, expected } of BOULDER_TEST_CASES)
    it(`should return uppercase grade for Bouldering (${input} -> ${expected})`, () => {
      const ascentDetails = {
        climbingDiscipline: climbingDisciplineSchema.parse('Boulder'),
        topoGrade: gradeSchema.parse(input),
      } satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
      expect(
        formatGrade({
          climbingDiscipline: ascentDetails.climbingDiscipline,
          grade: ascentDetails.topoGrade,
        }),
      ).toStrictEqual(expected)
    })

  const ROUTE_TEST_CASES = [
    { input: '7a', expected: '7a' },
    { input: '6b+', expected: '6b+' },
    { input: '8a', expected: '8a' },
  ] as const

  for (const { input, expected } of ROUTE_TEST_CASES)
    it(`should return grade as is for Route (${input} -> ${expected})`, () => {
      const ascentDetails = {
        climbingDiscipline: climbingDisciplineSchema.parse('Route'),
        topoGrade: gradeSchema.parse(input),
      } satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
      expect(
        formatGrade({
          climbingDiscipline: ascentDetails.climbingDiscipline,
          grade: ascentDetails.topoGrade,
        }),
      ).toStrictEqual(expected)
    })

  it('should return grade as is for Multi-Pitch (e.g., 8a -> 8a)', () => {
    const ascentDetails = {
      climbingDiscipline: climbingDisciplineSchema.parse('Multi-Pitch'),
      topoGrade: gradeSchema.parse('8a'),
    } satisfies Pick<Ascent, 'topoGrade' | 'climbingDiscipline'>
    expect(
      formatGrade({
        climbingDiscipline: ascentDetails.climbingDiscipline,
        grade: ascentDetails.topoGrade,
      }),
    ).toStrictEqual('8a')
  })
})
