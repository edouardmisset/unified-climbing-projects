import { assert, describe, it } from 'poku'
import sampleAscents from '~/backup/ascent-data-sample-2024-10-30.json' with {
  type: 'json',
}
import { type Ascent, ascentSchema } from '~/schema/ascent'
import { getRoutesVsBouldersPerYear } from './get-routes-vs-boulders-per-year'

describe('getRoutesVsBouldersPerYear', () => {
  const testAscents = ascentSchema.array().parse(sampleAscents)
  it('should return empty array for empty input', () => {
    const result = getRoutesVsBouldersPerYear([])
    assert.deepEqual(result, [])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        year: 2024,
        boulders: 1,
        bouldersColor: 'var(--boulder)',
        routes: 19,
        routesColor: 'var(--route)',
      },
    ]
    const result = getRoutesVsBouldersPerYear(
      testAscents.filter(({ date }) => new Date(date).getFullYear() === 2024),
    )
    assert.deepEqual(result, expected)
  })
})
