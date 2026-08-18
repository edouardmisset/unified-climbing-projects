import { describe, expect, it } from 'vite-plus/test'
import { ascentRequiresRedpoint, isAscentStyleValidForTries } from './ascent-rules'

describe('ascent style rules', () => {
  it('requires Redpoint only after the first try', () => {
    expect(ascentRequiresRedpoint(1)).toBe(false)
    expect(ascentRequiresRedpoint('1')).toBe(false)
    expect(ascentRequiresRedpoint(2)).toBe(true)
  })

  it('accepts only Redpoint after more than 1 try', () => {
    expect(isAscentStyleValidForTries('Onsight', 1)).toBe(true)
    expect(isAscentStyleValidForTries('Flash', 2)).toBe(false)
    expect(isAscentStyleValidForTries('Redpoint', 2)).toBe(true)
  })
})
