import { assert, describe, it } from 'poku'
import { isDateInYear } from './is-date-in-year'

describe('isDateInYear', () => {
  it('should return true when the date string matches the target year', () => {
    const dateStr = '2023-04-01'
    const result = isDateInYear(dateStr, 2023)
    assert.equal(result, true)
  })

  it('should return false when the date string does not match the target year', () => {
    const dateStr = '2023-04-01'
    const result = isDateInYear(dateStr, 2022)
    assert.equal(result, false)
  })

  it('should return false for an invalid date string', () => {
    const invalidDateStr = 'invalid-date'
    const result = isDateInYear(invalidDateStr, 2023)
    assert.equal(result, false)
  })
})
