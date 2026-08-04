import { describe, expect, it } from 'vite-plus/test'
import { formatFrenchDurationFromDays } from './format-duration'

describe('formatFrenchDurationFromDays', () => {
  it.each([
    [Number.NaN, '0 days'],
    [Number.POSITIVE_INFINITY, '0 days'],
    [-1, '0 days'],
    [0, '0 days'],
    [1, '1 day'],
    [7, '1 week'],
    [8, '1 week, 1 day'],
    [30, '1 month'],
    [38, '1 month, 1 week'],
    [60, '2 months'],
  ])('formats %s days as %s', (days, expected) => {
    expect(formatFrenchDurationFromDays(days)).toBe(expected)
  })

  it('rounds fractional days before formatting', () => {
    expect(formatFrenchDurationFromDays(1.6)).toBe('2 days')
  })
})
