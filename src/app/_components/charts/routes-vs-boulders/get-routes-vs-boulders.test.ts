import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import { getRoutesVsBoulders } from './get-routes-vs-boulders'

describe('getRoutesVsBoulders', () => {
  it('should return empty array for empty input', () => {
    const result = getRoutesVsBoulders([])
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
    const result = getRoutesVsBoulders(sampleAscents)
    assert.equal(
      result.reduce((sum, item) => sum + item.value, 0),
      sampleAscents.length,
    )
    assert.deepEqual(result, expected)
  })
})
