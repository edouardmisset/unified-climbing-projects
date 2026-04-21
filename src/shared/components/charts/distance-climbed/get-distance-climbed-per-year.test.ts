import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { getDistanceClimbedPerYear } from './get-distance-climbed-per-year'

describe('getDistanceClimbedPerYear', () => {
  it('should return empty array for empty input', () => {
    const result = getDistanceClimbedPerYear([])
    expect(result).toEqual([])
  })

  it('should compute distance and average height for a multiple years', () => {
    const expected = [
      {
        distance: 55,
        year: 2_017,
      },
      {
        distance: 155,
        year: 2_018,
      },
      {
        distance: 155,
        year: 2_019,
      },
      {
        distance: 290,
        year: 2_020,
      },
      {
        distance: 105,
        year: 2_021,
      },
      {
        distance: 300,
        year: 2_022,
      },
      {
        distance: 405,
        year: 2_023,
      },
      {
        distance: 455,
        year: 2_024,
      },
    ]
    const result = getDistanceClimbedPerYear(sampleAscents)
    expect(result).toEqual(expected)
  })
})
