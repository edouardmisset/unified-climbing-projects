import { describe, expect, it } from 'vitest'
import type { Ascent } from '~/schema/ascent'
import { calculateOnsightFlashRatio } from './calculate-onsight-flash-ratio'

describe('calculateOnsightFlashRatio', () => {
  it('should return 0 when there are no ascents', () => {
    const ascents: Ascent[] = []

    const result = calculateOnsightFlashRatio(ascents)

    expect(result).toBe(0)
  })

  it('should return 0 when there are no onsight or flash ascents', () => {
    const ascents: Ascent[] = [
      { style: 'Redpoint' } as Ascent,
      { style: 'Redpoint' } as Ascent,
      { style: 'Redpoint' } as Ascent,
    ]

    const result = calculateOnsightFlashRatio(ascents)

    expect(result).toBe(0)
  })

  it('should calculate ratio for only onsight ascents', () => {
    const ascents: Ascent[] = [{ style: 'Onsight' } as Ascent, { style: 'Onsight' } as Ascent]

    const result = calculateOnsightFlashRatio(ascents)
    const expected = 2 / 2

    expect(result).toBe(expected)
  })

  it('should calculate ratio for only flash ascents', () => {
    const ascents: Ascent[] = [{ style: 'Flash' } as Ascent, { style: 'Flash' } as Ascent]

    const result = calculateOnsightFlashRatio(ascents)
    const expected = 2 / 2

    expect(result).toBe(expected)
  })

  it('should calculate ratio for mixed onsight and flash', () => {
    const ascents: Ascent[] = [
      { style: 'Onsight' } as Ascent,
      { style: 'Flash' } as Ascent,
      { style: 'Onsight' } as Ascent,
    ]

    const result = calculateOnsightFlashRatio(ascents)
    const expected = 3 / 3

    expect(result).toBe(expected)
  })

  it('should calculate ratio for mixed styles including redpoint', () => {
    const ascents: Ascent[] = [
      { style: 'Onsight' } as Ascent,
      { style: 'Flash' } as Ascent,
      { style: 'Redpoint' } as Ascent,
      { style: 'Redpoint' } as Ascent,
    ]

    const result = calculateOnsightFlashRatio(ascents)
    const expected = 2 / 4

    expect(result).toBe(expected)
  })

  it('should handle single onsight ascent', () => {
    const ascents: Ascent[] = [{ style: 'Onsight' } as Ascent]

    const result = calculateOnsightFlashRatio(ascents)
    const expected = 1 / 1

    expect(result).toBe(expected)
  })

  it('should handle single flash ascent', () => {
    const ascents: Ascent[] = [{ style: 'Flash' } as Ascent]

    const result = calculateOnsightFlashRatio(ascents)
    const expected = 1 / 1

    expect(result).toBe(expected)
  })

  it('should return ratio without coefficient', () => {
    const ascents: Ascent[] = [{ style: 'Flash' } as Ascent, { style: 'Redpoint' } as Ascent]

    const result = calculateOnsightFlashRatio(ascents)
    const expected = 1 / 2

    expect(result).toBe(expected)
  })
})
