import { describe, expect, it } from 'vite-plus/test'
import {
  fromSessionTypeToBackgroundColor,
  fromSessionTypeToClassName,
  getSessionTypeColors,
} from './training-converter'

describe('fromSessionTypeToBackgroundColor', () => {
  it('should return a default surface color when type is undefined', () => {
    const result = fromSessionTypeToBackgroundColor(undefined)
    expect(result).toBe('var(--surface-1)')
  })

  it('should return the correct background color based on type', () => {
    const result = fromSessionTypeToBackgroundColor('Contact Strength')
    expect(result).toBe('var(--strength)')
  })
})

describe('fromSessionTypeToClassName', () => {
  it('should return undefined when type is undefined', () => {
    const result = fromSessionTypeToClassName(undefined)
    expect(result).toBeUndefined()
  })

  it('should return a class name based on type', () => {
    const result = fromSessionTypeToClassName('Contact Strength')
    expect(result).toBe('strength')
  })
})

describe('getSessionTypeColors', () => {
  it('should return default cell color when type is undefined', () => {
    const result = getSessionTypeColors({ type: undefined })
    expect(result).toBe('var(--cellColor)')
  })

  it('should return the correct color based on intensity and volume', () => {
    let result = getSessionTypeColors({
      intensityPercent: 40,
      type: 'Contact Strength',
      volumePercent: 40,
    })
    expect(result).toBe('var(--strengthLow)')

    result = getSessionTypeColors({
      intensityPercent: 90,
      type: 'Contact Strength',
      volumePercent: 90,
    })
    expect(result).toBe('var(--strengthHigh)')

    result = getSessionTypeColors({
      intensityPercent: 65,
      type: 'Contact Strength',
      volumePercent: 65,
    })
    expect(result).toBe('var(--strength)')
  })
})
