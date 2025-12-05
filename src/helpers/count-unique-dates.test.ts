import { describe, expect, it } from 'vitest'
import type { StringDate } from '~/types/generic'
import { countUniqueDates } from './count-unique-dates'

describe('countUniqueDates', () => {
  it('returns 0 for empty input', () => {
    const items: StringDate[] = []
    expect(countUniqueDates(items)).toBe(0)
  })

  it('counts unique dates across items', () => {
    const items: StringDate[] = [
      { date: '2024-01-01' },
      { date: '2024-01-01' },
      { date: '2024-01-02' },
      { date: '2024-01-03' },
      { date: '2024-01-03' },
    ]
    expect(countUniqueDates(items)).toBe(3)
  })

  it('deduplicates datetimes on the same day', () => {
    const items: StringDate[] = [
      { date: '2024-01-01T08:30:00.000Z' },
      { date: '2024-01-01T22:59:59.999Z' },
      { date: '2024-01-02T00:00:00.000Z' },
    ]
    expect(countUniqueDates(items)).toBe(2)
  })

  it('handles mixed ISO formats (with and without time)', () => {
    const items: StringDate[] = [
      { date: '2024-01-01' },
      { date: '2024-01-01T12:00:00Z' },
      { date: '2024-01-02' },
    ]
    expect(countUniqueDates(items)).toBe(2)
  })
})
