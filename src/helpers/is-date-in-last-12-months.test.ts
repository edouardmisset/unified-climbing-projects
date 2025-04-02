import { assert, describe, it } from 'poku'
import { isDateInLast12Months } from './is-date-in-last-12-months'

describe('isDateInLast12Months', () => {
  it('should return true for the current date', () => {
    const now = new Date()
    const currentDate = now.toISOString()
    const result = isDateInLast12Months(currentDate)
    assert.equal(result, true)
  })

  it('should return true for a date 6 months ago', () => {
    const pastDate = new Date()
    pastDate.setMonth(pastDate.getMonth() - 6)
    const result = isDateInLast12Months(pastDate.toISOString())
    assert.equal(result, true)
  })

  it('should return true for a date exactly 1 year ago at midnight', () => {
    const now = new Date()
    const lastYear = new Date(now)
    lastYear.setFullYear(now.getFullYear() - 1)
    lastYear.setHours(0, 0, 0, 0)
    const result = isDateInLast12Months(lastYear.toISOString())
    assert.equal(result, true)
  })

  it('should return false for a date older than 1 year', () => {
    const now = new Date()
    const lastYear = new Date(now)
    lastYear.setFullYear(now.getFullYear() - 1)
    lastYear.setHours(0, 0, 0, 0)
    const olderDate = new Date(lastYear)
    olderDate.setDate(olderDate.getDate() - 1)
    const result = isDateInLast12Months(olderDate.toISOString())
    assert.equal(result, false)
  })

  it('should return false for a future date', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    const result = isDateInLast12Months(futureDate.toISOString())
    assert.equal(result, false)
  })
})
