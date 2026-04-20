import { describe, expect, it } from 'vitest'
import { formatFrenchDurationFromDays } from './format-duration'
import { frenchConjunctiveListFormatter } from './list-formatter'
import { formatUnit } from './number-formatter'

describe('formatFrenchDurationFromDays', () => {
  it('formats a single week in French', () => {
    expect(formatFrenchDurationFromDays(7)).toBe(formatUnit(1, 'week', { unitDisplay: 'long' }))
  })

  it('formats the two largest French duration parts', () => {
    expect(formatFrenchDurationFromDays(45)).toBe(
      frenchConjunctiveListFormatter([
        formatUnit(1, 'month', { unitDisplay: 'long' }),
        formatUnit(2, 'week', { unitDisplay: 'long' }),
      ]),
    )
  })
  it('formats a single day in French', () => {
    expect(formatFrenchDurationFromDays(1)).toBe(formatUnit(1, 'day', { unitDisplay: 'long' }))
  })

  it('handles zero days', () => {
    expect(formatFrenchDurationFromDays(0)).toBe(formatUnit(0, 'day', { unitDisplay: 'long' }))
  })
})
