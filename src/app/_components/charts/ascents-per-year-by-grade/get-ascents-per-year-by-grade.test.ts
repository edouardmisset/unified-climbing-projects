import { assert, describe, it } from 'poku'
import sampleAscents from '~/backup/ascent-data-sample-2024-10-30.json' with {
  type: 'json',
}
import { ascentSchema } from '~/schema/ascent'
import { getAscentsPerYearByGrade } from './get-ascents-per-year-by-grade'

describe('getAscentsPerYearByGrade', () => {
  const testAscents = ascentSchema.array().parse(sampleAscents)
  it('should return empty array for empty input', () => {
    const result = getAscentsPerYearByGrade([])
    assert.deepEqual(result, [])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        year: 2024,
        '7a': 7,
        '7aColor': 'var(--7a)',
        '7a+': 4,
        '7a+Color': 'var(--7a_)',
        '7b': 5,
        '7bColor': 'var(--7b)',
        '7b+': 1,
        '7b+Color': 'var(--7b_)',
        '7c': 1,
        '7cColor': 'var(--7c)',
        '7c+': 1,
        '7c+Color': 'var(--7c_)',
        '8a': 0,
        '8aColor': 'var(--8a)',
        '8a+': 1,
        '8a+Color': 'var(--8a_)',
      },
    ]
    const result = getAscentsPerYearByGrade(
      testAscents.filter(({ date }) => new Date(date).getFullYear() === 2024),
    )
    assert.deepEqual(result, expected)
  })
})
