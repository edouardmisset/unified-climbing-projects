import { assert, describe, it } from 'poku'
import {
  fromGradeToBackgroundColor,
  fromGradeToClassName,
} from './ascent-converter'

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
