import { describe, expect, it } from 'vite-plus/test'
import { sampleAscents } from '~/backup/sample-ascents'
import { getAscentsPerDisciplinePerGrade } from './get-ascents-per-discipline-per-grade'

describe('getAscentsPerDisciplinePerGrade', () => {
  it('should return empty array for empty input', () => {
    const result = getAscentsPerDisciplinePerGrade([])
    expect(result).toStrictEqual([])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        Bouldering: 1,
        grade: '7a',
        Sport: 6,
      },
      {
        Bouldering: 0,
        grade: '7a+',
        Sport: 4,
      },
      {
        Bouldering: 0,
        grade: '7b',
        Sport: 5,
      },
      {
        Bouldering: 0,
        grade: '7b+',
        Sport: 1,
      },
      {
        Bouldering: 0,
        grade: '7c',
        Sport: 1,
      },
      {
        Bouldering: 0,
        grade: '7c+',
        Sport: 1,
      },
      {
        Bouldering: 0,
        grade: '8a',
        Sport: 0,
      },
      {
        Bouldering: 0,
        grade: '8a+',
        Sport: 1,
      },
    ]
    const result = getAscentsPerDisciplinePerGrade(
      sampleAscents.filter(({ date }) => new Date(date).getFullYear() === 2_024),
    )
    expect(result).toStrictEqual(expected)
  })
})
