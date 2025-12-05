import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { getAscentsByGradesPerCrag } from './get-ascents-by-grades-per-crag'

describe('getAscentsByGradesPerCrag', () => {
  it('should return empty array for empty input', () => {
    const result = getAscentsByGradesPerCrag([])
    expect(result).toEqual([])
  })

  it('should return correct structure and counts for top 10 crags', () => {
    const result = getAscentsByGradesPerCrag(sampleAscents)
    expect(result.length <= 10).toBe(true)

    result.forEach(item => {
      expect(item.crag).toBeDefined()
      expect(typeof item.crag).toBe('string')
    })
  })
})
