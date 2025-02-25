import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-data'
import { getGradeFrequencyAndColors } from './get-grade-frequency'

describe('getGradeFrequencyAndColors', () => {
  it('should return empty array for empty input', () => {
    const result = getGradeFrequencyAndColors([])
    assert.deepEqual(result, [])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        grade: '7a',
        Onsight: 17,
        OnsightColor: 'var(--onsight)',
        Flash: 10,
        FlashColor: 'var(--flash)',
        Redpoint: 11,
        RedpointColor: 'var(--redpoint)',
      },
      {
        grade: '7a+',
        Onsight: 9,
        OnsightColor: 'var(--onsight)',
        Flash: 3,
        FlashColor: 'var(--flash)',
        Redpoint: 3,
        RedpointColor: 'var(--redpoint)',
      },
      {
        grade: '7b',
        Onsight: 13,
        OnsightColor: 'var(--onsight)',
        Flash: 2,
        FlashColor: 'var(--flash)',
        Redpoint: 3,
        RedpointColor: 'var(--redpoint)',
      },
      {
        grade: '7b+',
        Onsight: 1,
        OnsightColor: 'var(--onsight)',
        Flash: 3,
        FlashColor: 'var(--flash)',
        Redpoint: 2,
        RedpointColor: 'var(--redpoint)',
      },
      {
        grade: '7c',
        Onsight: 0,
        OnsightColor: 'var(--onsight)',
        Flash: 1,
        FlashColor: 'var(--flash)',
        Redpoint: 7,
        RedpointColor: 'var(--redpoint)',
      },
      {
        grade: '7c+',
        Onsight: 1,
        OnsightColor: 'var(--onsight)',
        Flash: 2,
        FlashColor: 'var(--flash)',
        Redpoint: 7,
        RedpointColor: 'var(--redpoint)',
      },
    ]
    const resultFor7Degree = getGradeFrequencyAndColors(
      sampleAscents.filter(({ topoGrade }) => topoGrade.startsWith('7')),
    )
    assert.deepEqual(resultFor7Degree, expected)
  })
})
