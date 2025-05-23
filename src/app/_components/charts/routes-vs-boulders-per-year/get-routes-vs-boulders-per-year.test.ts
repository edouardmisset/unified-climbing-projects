import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import { getRoutesVsBouldersPerYear } from './get-routes-vs-boulders-per-year'

describe('getRoutesVsBouldersPerYear', () => {
  it('should return empty array for empty input', () => {
    const result = getRoutesVsBouldersPerYear([])
    assert.deepEqual(result, [])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        year: 2024,
        Boulder: 1,
        BoulderColor: 'var(--boulder)',
        Route: 19,
        RouteColor: 'var(--route)',
      },
    ]
    const result = getRoutesVsBouldersPerYear(
      sampleAscents.filter(({ date }) => new Date(date).getFullYear() === 2024),
    )
    assert.deepEqual(result, expected)
  })
})
