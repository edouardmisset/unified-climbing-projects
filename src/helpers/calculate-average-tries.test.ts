import { describe, expect, it } from 'vitest'
import type { Ascent } from '~/schema/ascent'
import { calculateAverageTries } from './calculate-average-tries'

describe('calculateAverageTries', () => {
  it('should return 0 when there are no ascents', () => {
    const ascents: Ascent[] = []

    const result = calculateAverageTries(ascents)

    expect(result).toBe(0)
  })

  it('should return 1 when all ascents are first try', () => {
    const ascents: Ascent[] = [
      { tries: 1 } as Ascent,
      { tries: 1 } as Ascent,
      { tries: 1 } as Ascent,
    ]

    const result = calculateAverageTries(ascents)

    expect(result).toBe(1)
  })

  it('should calculate correct ratio for multiple tries', () => {
    const ascents: Ascent[] = [
      { tries: 2 } as Ascent,
      { tries: 3 } as Ascent,
      { tries: 5 } as Ascent,
    ]

    const result = calculateAverageTries(ascents)
    const expected = 3 / (2 + 3 + 5) // 3 ascents / 10 total tries = 0.3

    expect(result).toBe(expected)
  })

  it('should return lower ratio for higher average tries', () => {
    const efficientAscents: Ascent[] = [{ tries: 1 } as Ascent, { tries: 2 } as Ascent]
    const lessEfficientAscents: Ascent[] = [{ tries: 5 } as Ascent, { tries: 10 } as Ascent]

    const efficientResult = calculateAverageTries(efficientAscents)
    const lessEfficientResult = calculateAverageTries(lessEfficientAscents)

    expect(efficientResult).toBeGreaterThan(lessEfficientResult)
  })

  it('should handle single ascent', () => {
    const ascents: Ascent[] = [{ tries: 3 } as Ascent]

    const result = calculateAverageTries(ascents)
    const expected = 1 / 3

    expect(result).toBe(expected)
  })

  it('should return 0 when all ascents have 0 tries', () => {
    const ascents: Ascent[] = [
      { tries: 0 } as Ascent,
      { tries: 0 } as Ascent,
      { tries: 0 } as Ascent,
    ]

    const result = calculateAverageTries(ascents)

    expect(result).toBe(0)
  })
})
