import { assert, describe, it } from 'poku'
import {
  fromSessionTypeToBackgroundColor,
  fromSessionTypeToClassName,
  getSessionTypeColors,
} from './training-converter'

describe('fromSessionTypeToBackgroundColor', () => {
  it('should return a default surface color when sessionType is undefined', () => {
    const result = fromSessionTypeToBackgroundColor(undefined)
    assert.equal(result, 'var(--surface-1)')
  })

  it('should return the correct background color based on sessionType', () => {
    const result = fromSessionTypeToBackgroundColor('CS')
    assert.equal(result, 'var(--strength)')
  })
})

describe('fromSessionTypeToClassName', () => {
  it('should return undefined when sessionType is undefined', () => {
    const result = fromSessionTypeToClassName(undefined)
    assert.equal(result, undefined)
  })

  it('should return a class name based on sessionType', () => {
    const result = fromSessionTypeToClassName('CS')
    assert.equal(result, 'strength')
  })
})

describe('getSessionTypeColors', () => {
  it('should return default cell color when sessionType is undefined', () => {
    const result = getSessionTypeColors({ sessionType: undefined })
    assert.equal(result, 'var(--cell-color)')
  })

  it('should return the correct color based on intensity and volume', () => {
    let result = getSessionTypeColors({
      intensityPercent: 40,
      sessionType: 'CS',
      volumePercent: 40,
    })
    assert.equal(result, 'var(--strength-low)')

    result = getSessionTypeColors({
      intensityPercent: 90,
      sessionType: 'CS',
      volumePercent: 90,
    })
    assert.equal(result, 'var(--strength-high)')

    result = getSessionTypeColors({
      intensityPercent: 65,
      sessionType: 'CS',
      volumePercent: 65,
    })
    assert.equal(result, 'var(--strength)')
  })
})
