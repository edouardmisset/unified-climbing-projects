import { assert, describe, it } from 'poku'
import {
  getDayOfYear,
  getDaysInYear,
  getMostFrequentDate,
  getWeekNumber,
  getWeeksInYear,
} from './date'

describe('getWeekNumber', () => {
  it('should return the correct week number for a given date', () => {
    const date = new Date(2024, 0, 20)
    const result = getWeekNumber(date)
    assert.equal(result, 4)
  })
})

describe('getWeeksInYear', () => {
  it('should return the correct number of weeks in a year', () => {
    const year = 2023
    const result = getWeeksInYear(year)
    assert.equal(result, 52)
  })
})

describe('getDaysInYear', () => {
  it('should return the correct number of days in a non-leap year', () => {
    const year = 2023
    const result = getDaysInYear(year)
    assert.equal(result, 365)
  })

  it('should return the correct number of days in a leap year', () => {
    const year = 2024
    const result = getDaysInYear(year)
    assert.equal(result, 366)
  })
})

describe('getDayOfYear', () => {
  it('should return the correct day of the year for a given date', () => {
    const date = new Date(2024, 5, 20)
    const result = getDayOfYear(date)
    assert.equal(result, 171)
  })
})

describe('getMostFrequentDate', () => {
  it('should return the most frequent date and its frequency', () => {
    const data = [
      { date: '2024-01-01' },
      { date: '2024-01-02' },
      { date: '2024-01-02' },
      { date: '2024-01-03' },
      { date: '2024-01-03' },
      { date: '2024-01-03' },
    ]
    const result = getMostFrequentDate(data)
    assert.deepEqual(result, ['2024-01-03', 3])
  })

  it('should return a default value when the input array is empty', () => {
    const result = getMostFrequentDate([])
    assert.deepEqual(result, ['', 0])
  })
})
