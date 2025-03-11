import { assert, describe, it } from 'poku'
import {
  fromGradeToBackgroundColor,
  fromGradeToClassName,
  fromSessionTypeToBackgroundColor,
  fromSessionTypeToClassName,
  getSessionTypeColors,
} from './converter'

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
      sessionType: 'CS',
      intensityPercent: 40,
      volumePercent: 40,
    })
    assert.equal(result, 'var(--strength-low)')

    result = getSessionTypeColors({
      sessionType: 'CS',
      intensityPercent: 90,
      volumePercent: 90,
    })
    assert.equal(result, 'var(--strength-high)')

    result = getSessionTypeColors({
      sessionType: 'CS',
      intensityPercent: 65,
      volumePercent: 65,
    })
    assert.equal(result, 'var(--strength)')
  })
})

describe('fromGradeToBackgroundColor', () => {
  it('should return black when grade is undefined', () => {
    const result = fromGradeToBackgroundColor(undefined)
    assert.equal(result, 'black')
  })

  it('should return the correct background color based on grade', () => {
    const result = fromGradeToBackgroundColor('7a+')
    assert.equal(result, 'var(--7a_)')
  })
})

describe('fromGradeToClassName', () => {
  it('should return undefined when grade is undefined', () => {
    const result = fromGradeToClassName(undefined)
    assert.equal(result, undefined)
  })

  it('should return a class name with underscores replacing plus signs', () => {
    const result = fromGradeToClassName('7a+')
    assert.equal(result, '_7a_')
  })
})
