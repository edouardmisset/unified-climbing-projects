import { describe, expect, it } from 'vite-plus/test'
import { getDomainFromPathname, getDomainSwitchPath } from './domain'

describe('domain routes', () => {
  it('derives the selected mode from the first URL segment', () => {
    expect(getDomainFromPathname('/ascents/calendar')).toBe('ascents')
    expect(getDomainFromPathname('/training/dashboard')).toBe('training')
    expect(getDomainFromPathname('/settings')).toBeUndefined()
  })

  it('keeps equivalent route segments when switching modes', () => {
    expect(getDomainSwitchPath('/ascents/calendar', 'training')).toBe('/training/calendar')
    expect(getDomainSwitchPath('/training/visuals/qr-code', 'ascents')).toBe(
      '/ascents/visuals/qr-code',
    )
  })

  it('returns to the target record list when a selected ascent has no counterpart', () => {
    expect(getDomainSwitchPath('/ascents/records/ascent-123', 'training')).toBe('/training')
  })
})
