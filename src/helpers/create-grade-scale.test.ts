import { assert, describe, it } from 'poku'
import type { Grade } from '~/schema/ascent'
import { createGradeScale } from './create-grade-scale'

describe('createGradeScale', () => {
  it('should return an empty array when given an invalid grade', () => {
    const lowerGrade = 'invalidGrade' as Grade
    const higherGrade = '7a'
    const result = createGradeScale(lowerGrade, higherGrade)
    assert.deepEqual(result, [])

    const lowerGrade2 = '8b'
    const higherGrade2 = 'invalidGrade' as Grade
    const result2 = createGradeScale(lowerGrade2, higherGrade2)
    assert.deepEqual(result2, [])
  })

  it('should return an empty array when lowerGrade > higherGrade', () => {
    const lowerGrade = '8a'
    const higherGrade = '6a'
    const result = createGradeScale(lowerGrade, higherGrade)
    assert.deepEqual(result, [])
  })

  it('should return a grade scale between the specified lower and higher grades', () => {
    const lowerGrade = '6a'
    const higherGrade = '7a'
    const expectedScale: Grade[] = ['6a', '6a+', '6b', '6b+', '6c', '6c+', '7a']
    const result = createGradeScale(lowerGrade, higherGrade)
    assert.deepEqual(result, expectedScale)
  })
})
