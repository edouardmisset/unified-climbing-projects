import { describe, expect, it } from 'vitest'
import { getSessionColor } from './training-converter'

describe('getSessionColor', () => {
  it('should return default cell color when sessionType is undefined', () => {
    const result = getSessionColor({ sessionType: undefined })
    expect(result).toBe('var(--cellColor)')
  })

  it('should return the correct color based on intensity and volume', () => {
    let result = getSessionColor({
      intensityPercent: 40,
      sessionType: 'Contact Strength',
      volumePercent: 40,
    })
    expect(result).toBe('var(--strengthLow)')

    result = getSessionColor({
      intensityPercent: 90,
      sessionType: 'Contact Strength',
      volumePercent: 90,
    })
    expect(result).toBe('var(--strengthHigh)')

    result = getSessionColor({
      intensityPercent: 65,
      sessionType: 'Contact Strength',
      volumePercent: 65,
    })
    expect(result).toBe('var(--strength)')
  })
})
