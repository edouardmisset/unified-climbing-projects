import { describe, expect, it } from 'vitest'
import {
  fromSessionTypeToBackgroundColor,
  fromSessionTypeToClassName,
  getSessionTypeColors,
} from './training-converter'

describe('fromSessionTypeToBackgroundColor', () => {
  it('should return a default surface color when sessionType is undefined', () => {
    const result = fromSessionTypeToBackgroundColor(undefined)
    expect(result).toBe('var(--surface-1)')
  })

  it('should return the correct background color based on sessionType', () => {
    const result = fromSessionTypeToBackgroundColor('CS')
    expect(result).toBe('var(--strength)')
  })
})

describe('fromSessionTypeToClassName', () => {
  it('should return undefined when sessionType is undefined', () => {
    const result = fromSessionTypeToClassName(undefined)
    expect(result).toBe(undefined)
  })

  it('should return a class name based on sessionType', () => {
    const result = fromSessionTypeToClassName('CS')
    expect(result).toBe('strength')
  })
})

describe('getSessionTypeColors', () => {
  it('should return default cell color when sessionType is undefined', () => {
    const result = getSessionTypeColors({ sessionType: undefined })
    expect(result).toBe('var(--cellColor)')
  })

  it('should return the correct color based on intensity and volume', () => {
    let result = getSessionTypeColors({
      intensityPercent: 40,
      sessionType: 'CS',
      volumePercent: 40,
    })
    expect(result).toBe('var(--strengthLow)')

    result = getSessionTypeColors({
      intensityPercent: 90,
      sessionType: 'CS',
      volumePercent: 90,
    })
    expect(result).toBe('var(--strengthHigh)')

    result = getSessionTypeColors({
      intensityPercent: 65,
      sessionType: 'CS',
      volumePercent: 65,
    })
    expect(result).toBe('var(--strength)')
  })
})
