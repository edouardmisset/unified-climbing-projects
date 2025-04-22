import { objectKeys } from '@edouardmisset/object'
import { assert, describe, it } from 'poku'
import { DEFAULT_GRADE } from '~/constants/ascents'
import { GRADE_TO_NUMBER, type Grade } from '~/schema/ascent'
import {
  NUMBER_TO_GRADE,
  fromGradeToNumber,
  fromNumberToGrade,
} from './grade-converter'

describe('fromGradeToNumber', () => {
  it('should convert a valid grade correctly', () => {
    const validGrade = objectKeys(
      GRADE_TO_NUMBER,
    )[0] as keyof typeof GRADE_TO_NUMBER
    const expectedNumber = GRADE_TO_NUMBER[validGrade]
    const result = fromGradeToNumber(validGrade)
    assert.equal(result, expectedNumber)
  })

  it('should return 1 for an invalid grade', () => {
    const result = fromGradeToNumber('invalid_grade' as unknown as Grade)
    assert.equal(result, 1)
  })
})

describe('fromNumberToGrade', () => {
  it('should convert a valid number to its corresponding grade', () => {
    const validNumberKey = objectKeys(
      NUMBER_TO_GRADE,
    )[0] as keyof typeof NUMBER_TO_GRADE

    const expectedGrade = NUMBER_TO_GRADE[validNumberKey]
    const result = fromNumberToGrade(validNumberKey)
    assert.equal(result, expectedGrade)
  })

  it('should return `DEFAULT_GRADE` for an invalid number', () => {
    const invalidNumber = -9999
    const result = fromNumberToGrade(invalidNumber)
    assert.equal(result, DEFAULT_GRADE)
  })
})
