import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { getAscentsPerDisciplinePerYear } from './get-ascents-per-discipline-per-year'

describe('getAscentsPerDisciplinePerYear', () => {
  it('should return empty array for empty input', () => {
    const result = getAscentsPerDisciplinePerYear([])
    expect(result).toEqual([])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        bouldering: 1,
        boulderingColor: 'var(--bouldering)',
        sport: 19,
        sportColor: 'var(--sport)',
        year: 2024,
      },
    ]
    const result = getAscentsPerDisciplinePerYear(
      sampleAscents.filter(({ date }) => new Date(date).getFullYear() === 2024),
    )
    expect(result).toEqual(expected)
  })
})
