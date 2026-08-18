import { describe, expect, it } from 'vite-plus/test'
import { sampleAscents } from '~/data/sample-ascents'
import { getDistanceClimbedPerYear } from './get-distance-climbed-per-year'

describe('getDistanceClimbedPerYear', () => {
  it('should return empty array for empty input', () => {
    const result = getDistanceClimbedPerYear([])
    expect(result).toStrictEqual([])
  })

  it('should compute distance and average height for a multiple years', () => {
    const expected = [
      {
        averageHeight: 18,
        distance: 55,
        year: 2_017,
      },
      {
        averageHeight: 19,
        distance: 155,
        year: 2_018,
      },
      {
        averageHeight: 19,
        distance: 155,
        year: 2_019,
      },
      {
        averageHeight: 21,
        distance: 290,
        year: 2_020,
      },
      {
        averageHeight: 21,
        distance: 105,
        year: 2_021,
      },
      {
        averageHeight: 23,
        distance: 300,
        year: 2_022,
      },
      {
        averageHeight: 29,
        distance: 405,
        year: 2_023,
      },
      {
        averageHeight: 24,
        distance: 455,
        year: 2_024,
      },
    ]
    const result = getDistanceClimbedPerYear(sampleAscents)
    expect(result).toStrictEqual(expected)
  })
})
