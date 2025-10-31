import { describe, expect, it } from 'vitest'
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
        discipline: 'Bouldering',
        grade: input,
      } as const satisfies Pick<Ascent, 'grade' | 'discipline'>
      expect(
        formatGrade({
          discipline: ascentDetails.discipline,
          grade: ascentDetails.grade,
        }),
      ).toStrictEqual(expected)
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
        discipline: 'Sport',
        grade: input,
      } as const satisfies Pick<Ascent, 'grade' | 'discipline'>
      expect(
        formatGrade({
          discipline: ascentDetails.discipline,
          grade: ascentDetails.grade,
        }),
      ).toStrictEqual(expected)
    })
  }

  it('should return grade as is for Multi-Pitch (e.g., 8a -> 8a)', () => {
    const ascentDetails = {
      discipline: 'Multi-Pitch',
      grade: '8a',
    } as const satisfies Pick<Ascent, 'grade' | 'discipline'>
    expect(
      formatGrade({
        discipline: ascentDetails.discipline,
        grade: ascentDetails.grade,
      }),
    ).toStrictEqual('8a')
  })
})
