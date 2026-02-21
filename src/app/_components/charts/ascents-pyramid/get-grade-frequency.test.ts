import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { getGradeFrequencyAndColors } from './get-grade-frequency'

describe('getGradeFrequencyAndColors', () => {
  it('should return empty array for empty input', () => {
    const result = getGradeFrequencyAndColors([])
    expect(result).toEqual([])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        Flash: 10,
        grade: '7a',
        Onsight: 17,
        Redpoint: 11,
      },
      {
        Flash: 3,
        grade: '7a+',
        Onsight: 9,
        Redpoint: 3,
      },
      {
        Flash: 2,
        grade: '7b',
        Onsight: 13,
        Redpoint: 3,
      },
      {
        Flash: 3,
        grade: '7b+',
        Onsight: 1,
        Redpoint: 2,
      },
      {
        Flash: 1,
        grade: '7c',
        Onsight: 0,
        Redpoint: 7,
      },
      {
        Flash: 2,
        grade: '7c+',
        Onsight: 1,
        Redpoint: 7,
      },
    ]
    const resultFor7Degree = getGradeFrequencyAndColors(
      sampleAscents.filter(({ topoGrade }) => topoGrade.startsWith('7')),
    )
    expect(resultFor7Degree).toEqual(expected)
  })
})
