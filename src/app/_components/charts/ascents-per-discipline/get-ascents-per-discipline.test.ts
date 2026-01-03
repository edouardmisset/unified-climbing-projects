import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { BOULDERING, SPORT } from '~/schema/ascent'
import { getAscentsPerDiscipline } from './get-ascents-per-discipline'

describe('getAscentsPerDiscipline', () => {
  it('should return empty array for empty input', () => {
    const result = getAscentsPerDiscipline([])
    expect(result).toEqual([])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        color: 'var(--sport)',
        id: SPORT,
        label: SPORT,
        value: 84,
      },
      {
        color: 'var(--bouldering)',
        id: BOULDERING,
        label: BOULDERING,
        value: 16,
      },
    ]
    const result = getAscentsPerDiscipline(sampleAscents)
    const totalValue = result.reduce((sum, item) => sum + item.value, 0)
    expect(totalValue).toEqual(sampleAscents.length)
    expect(result).toEqual(expected)
  })
})
