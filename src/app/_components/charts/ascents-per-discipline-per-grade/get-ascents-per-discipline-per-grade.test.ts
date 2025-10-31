import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { getAscentsPerDisciplinePerGrade } from './get-ascents-per-discipline-per-grade'

describe('getAscentsPerDisciplinePerGrade', () => {
  it('should return empty array for empty input', () => {
    const result = getAscentsPerDisciplinePerGrade([])
    expect(result).toEqual([])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        Bouldering: 1,
        BoulderingColor: 'var(--bouldering)',
        grade: '7a',
        Sport: 6,
        SportColor: 'var(--sport)',
      },
      {
        Bouldering: 0,
        BoulderingColor: 'var(--bouldering)',
        grade: '7a+',
        Sport: 4,
        SportColor: 'var(--sport)',
      },
      {
        Bouldering: 0,
        BoulderingColor: 'var(--bouldering)',
        grade: '7b',
        Sport: 5,
        SportColor: 'var(--sport)',
      },
      {
        Bouldering: 0,
        BoulderingColor: 'var(--bouldering)',
        grade: '7b+',
        Sport: 1,
        SportColor: 'var(--sport)',
      },
      {
        Bouldering: 0,
        BoulderingColor: 'var(--bouldering)',
        grade: '7c',
        Sport: 1,
        SportColor: 'var(--sport)',
      },
      {
        Bouldering: 0,
        BoulderingColor: 'var(--bouldering)',
        grade: '7c+',
        Sport: 1,
        SportColor: 'var(--sport)',
      },
      {
        Bouldering: 0,
        BoulderingColor: 'var(--bouldering)',
        grade: '8a',
        Sport: 0,
        SportColor: 'var(--sport)',
      },
      {
        Bouldering: 0,
        BoulderingColor: 'var(--bouldering)',
        grade: '8a+',
        Sport: 1,
        SportColor: 'var(--sport)',
      },
    ]
    const result = getAscentsPerDisciplinePerGrade(
      sampleAscents.filter(({ date }) => new Date(date).getFullYear() === 2024),
    )
    expect(result).toEqual(expected)
  })
})
