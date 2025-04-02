import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import { GRADE_TO_POINTS, STYLE_TO_POINTS } from '~/schema/ascent'
import {
  fromAscentToPoints,
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

describe('fromAscentToPoints', () => {
  it('should return the sum of grade and style points when both keys exist', () => {
    const onsight7a = sampleAscents[0]
    const redpoint7b = sampleAscents[1]
    if (!onsight7a || !redpoint7b) {
      throw new Error('Ascent not found')
    }
    const expectedGradePoints = GRADE_TO_POINTS['7a'] ?? 0
    const expectedStylePoints = STYLE_TO_POINTS.Onsight ?? 0
    const expected = expectedGradePoints + expectedStylePoints
    const result = fromAscentToPoints(onsight7a)
    assert.equal(result, expected)

    const expectedGradePoints2 = GRADE_TO_POINTS['7b'] ?? 0
    const expectedStylePoints2 = STYLE_TO_POINTS.Redpoint ?? 0
    const expected2 = expectedGradePoints2 + expectedStylePoints2
    const result2 = fromAscentToPoints(redpoint7b)
    assert.equal(result2, expected2)
  })
})
