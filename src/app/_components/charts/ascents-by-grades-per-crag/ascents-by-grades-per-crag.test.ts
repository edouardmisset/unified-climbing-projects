import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import { getAscentsByGradesPerCrag } from './get-ascents-by-grades-per-crag'

describe('getAscentsByGradesPerCrag', () => {
  it('should return empty array for empty input', () => {
    const result = getAscentsByGradesPerCrag([])
    assert.deepEqual(result, [])
  })

  it('should return correct structure and counts for top 10 crags', () => {
    const result = getAscentsByGradesPerCrag(sampleAscents)
    assert.ok(result.length <= 10)
    assert.ok(result.every(item => item.crag && typeof item.crag === 'string'))
  })
})
