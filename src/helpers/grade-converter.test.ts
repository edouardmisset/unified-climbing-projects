import { objectKeys } from '@edouardmisset/object'
import { describe, expect, it } from 'vitest'
import { DEFAULT_GRADE } from '~/constants/ascents'
import { GRADE_TO_NUMBER, type Grade } from '~/schema/ascent'
import {
  fromGradeToNumber,
  fromNumberToGrade,
  NUMBER_TO_GRADE,
} from './grade-converter'

describe('fromGradeToNumber', () => {
  it('should convert a valid grade correctly', () => {
    const validGrade = objectKeys(
      GRADE_TO_NUMBER,
    )[0] as keyof typeof GRADE_TO_NUMBER
    const expectedNumber = GRADE_TO_NUMBER[validGrade]
    const result = fromGradeToNumber(validGrade)
    expect(result).toBe(expectedNumber)
  })

  it('should return 1 for an invalid grade', () => {
    const result = fromGradeToNumber('invalid_grade' as unknown as Grade)
    expect(result).toBe(1)
  })
})

describe('fromNumberToGrade', () => {
  it('should convert a valid number to its corresponding grade', () => {
    const validNumberKey = objectKeys(
      NUMBER_TO_GRADE,
    )[0] as keyof typeof NUMBER_TO_GRADE

    const expectedGrade = NUMBER_TO_GRADE[validNumberKey]
    const result = fromNumberToGrade(validNumberKey)
    expect(result).toBe(expectedGrade)
  })

  it('should return `DEFAULT_GRADE` for an invalid number', () => {
    const invalidNumber = -9999
    const result = fromNumberToGrade(invalidNumber)
    expect(result).toBe(DEFAULT_GRADE)
  })
})
