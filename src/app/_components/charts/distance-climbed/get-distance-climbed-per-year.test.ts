import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import { getDistanceClimbedPerYear } from './get-distance-climbed-per-year'

describe('getDistanceClimbedPerYear', () => {
  it('should return empty array for empty input', () => {
    const result = getDistanceClimbedPerYear([])
    assert.deepEqual(result, [])
  })

  it('should compute distance and average height for a multiple years', () => {
    const expected = [
      {
        year: 2017,
        distance: 55,
      },
      {
        year: 2018,
        distance: 155,
      },
      {
        year: 2019,
        distance: 155,
      },
      {
        year: 2020,
        distance: 290,
      },
      {
        year: 2021,
        distance: 105,
      },
      {
        year: 2022,
        distance: 300,
      },
      {
        year: 2023,
        distance: 405,
      },
      {
        year: 2024,
        distance: 455,
      },
    ]
    const result = getDistanceClimbedPerYear(sampleAscents)
    assert.deepEqual(result, expected)
  })
})
