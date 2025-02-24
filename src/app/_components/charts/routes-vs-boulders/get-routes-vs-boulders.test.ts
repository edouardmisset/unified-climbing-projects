import { assert, describe, it } from 'poku'
import sampleAscents from '~/backup/ascent-data-sample-2024-10-30.json' with {
  type: 'json',
}
import { ascentSchema } from '~/schema/ascent'
import { getRoutesVsBoulders } from './get-routes-vs-boulders'

describe('getRoutesVsBoulders', () => {
  const testAscents = ascentSchema.array().parse(sampleAscents)
  it('should return empty array for empty input', () => {
    const result = getRoutesVsBoulders([])
    assert.deepEqual(result, [])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        id: 'Route',
        label: 'Route',
        value: 84,
        color: 'var(--route)',
      },
      {
        id: 'Boulder',
        label: 'Boulder',
        value: 16,
        color: 'var(--boulder)',
      },
    ]
    const result = getRoutesVsBoulders(testAscents)
    assert.equal(
      result.reduce((sum, item) => sum + item.value, 0),
      testAscents.length,
    )
    assert.deepEqual(result, expected)
  })
})
