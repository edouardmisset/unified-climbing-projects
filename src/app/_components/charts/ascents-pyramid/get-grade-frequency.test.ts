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
        FlashColor: 'var(--flash)',
        grade: '7a',
        Onsight: 17,
        OnsightColor: 'var(--onsight)',
        Redpoint: 11,
        RedpointColor: 'var(--redpoint)',
      },
      {
        Flash: 3,
        FlashColor: 'var(--flash)',
        grade: '7a+',
        Onsight: 9,
        OnsightColor: 'var(--onsight)',
        Redpoint: 3,
        RedpointColor: 'var(--redpoint)',
      },
      {
        Flash: 2,
        FlashColor: 'var(--flash)',
        grade: '7b',
        Onsight: 13,
        OnsightColor: 'var(--onsight)',
        Redpoint: 3,
        RedpointColor: 'var(--redpoint)',
      },
      {
        Flash: 3,
        FlashColor: 'var(--flash)',
        grade: '7b+',
        Onsight: 1,
        OnsightColor: 'var(--onsight)',
        Redpoint: 2,
        RedpointColor: 'var(--redpoint)',
      },
      {
        Flash: 1,
        FlashColor: 'var(--flash)',
        grade: '7c',
        Onsight: 0,
        OnsightColor: 'var(--onsight)',
        Redpoint: 7,
        RedpointColor: 'var(--redpoint)',
      },
      {
        Flash: 2,
        FlashColor: 'var(--flash)',
        grade: '7c+',
        Onsight: 1,
        OnsightColor: 'var(--onsight)',
        Redpoint: 7,
        RedpointColor: 'var(--redpoint)',
      },
    ]
    const resultFor7Degree = getGradeFrequencyAndColors(
      sampleAscents.filter(({ grade: topoGrade }) => topoGrade.startsWith('7')),
    )
    expect(resultFor7Degree).toEqual(expected)
  })
})
