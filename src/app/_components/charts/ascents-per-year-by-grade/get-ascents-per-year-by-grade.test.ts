import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import { getAscentsPerYearByGrade } from './get-ascents-per-year-by-grade'

describe('getAscentsPerYearByGrade', () => {
  it('should return empty array for empty input', () => {
    const result = getAscentsPerYearByGrade([])
    assert.deepEqual(result, [])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        '7a': 7,
        '7a+': 4,
        '7a+Color': 'var(--7a_)',
        '7aColor': 'var(--7a)',
        '7b': 5,
        '7b+': 1,
        '7b+Color': 'var(--7b_)',
        '7bColor': 'var(--7b)',
        '7c': 1,
        '7c+': 1,
        '7c+Color': 'var(--7c_)',
        '7cColor': 'var(--7c)',
        '8a': 0,
        '8a+': 1,
        '8a+Color': 'var(--8a_)',
        '8aColor': 'var(--8a)',
        year: 2024,
      },
    ]
    const result = getAscentsPerYearByGrade(
      sampleAscents.filter(({ date }) => new Date(date).getFullYear() === 2024),
    )
    assert.deepEqual(result, expected)
  })
})
