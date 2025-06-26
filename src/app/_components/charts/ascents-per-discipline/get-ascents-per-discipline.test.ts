import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import { getAscentsPerDiscipline } from './get-ascents-per-discipline'

describe('getAscentsPerDiscipline', () => {
  it('should return empty array for empty input', () => {
    const result = getAscentsPerDiscipline([])
    assert.deepEqual(result, [])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        color: 'var(--route)',
        id: 'Route',
        label: 'Route',
        value: 84,
      },
      {
        color: 'var(--boulder)',
        id: 'Boulder',
        label: 'Boulder',
        value: 16,
      },
    ]
    const result = getAscentsPerDiscipline(sampleAscents)
    assert.equal(
      result.reduce((sum, item) => sum + item.value, 0),
      sampleAscents.length,
    )
    assert.deepEqual(result, expected)
  })
})
