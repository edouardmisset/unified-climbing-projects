import { assert, describe, it } from 'poku'
import {
  extractDateFromISODateString,
  fromDateToStringDate,
  getDayOfYear,
  getDaysInYear,
  getLastSaturday,
  getLastSunday,
  getMostFrequentDate,
  getWeekNumber,
  getWeeksInYear,
  getYesterday,
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

describe('getYesterday', () => {
  it('should return yesterday at noon (relative to now)', () => {
    const today = new Date()
    const expected = new Date(today)
    expected.setDate(today.getDate() - 1)
    expected.setHours(12, 0, 0, 0)
    const actual = getYesterday()
    assert.equal(actual.getFullYear(), expected.getFullYear())
    assert.equal(actual.getMonth(), expected.getMonth())
    assert.equal(actual.getDate(), expected.getDate())
    assert.equal(actual.getHours(), 12)
    assert.equal(actual.getMinutes(), 0)
    assert.equal(actual.getSeconds(), 0)
    assert.equal(actual.getMilliseconds(), 0)
  })
})

describe('getLastSaturday', () => {
  it('should return the previous Saturday at noon (relative to now)', () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysSinceSaturday = dayOfWeek === 6 ? 7 : dayOfWeek + 1
    const expected = new Date(today)
    expected.setDate(today.getDate() - daysSinceSaturday)
    expected.setHours(12, 0, 0, 0)
    const actual = getLastSaturday()
    assert.equal(actual.getFullYear(), expected.getFullYear())
    assert.equal(actual.getMonth(), expected.getMonth())
    assert.equal(actual.getDate(), expected.getDate())
    assert.equal(actual.getHours(), 12)
    assert.equal(actual.getMinutes(), 0)
    assert.equal(actual.getSeconds(), 0)
    assert.equal(actual.getMilliseconds(), 0)
  })
})

describe('getLastSunday', () => {
  it('should return the previous Sunday at noon (relative to now)', () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysSinceSunday = dayOfWeek === 0 ? 7 : dayOfWeek
    const expected = new Date(today)
    expected.setDate(today.getDate() - daysSinceSunday)
    expected.setHours(12, 0, 0, 0)
    const actual = getLastSunday()
    assert.equal(actual.getFullYear(), expected.getFullYear())
    assert.equal(actual.getMonth(), expected.getMonth())
    assert.equal(actual.getDate(), expected.getDate())
    assert.equal(actual.getHours(), 12)
    assert.equal(actual.getMinutes(), 0)
    assert.equal(actual.getSeconds(), 0)
    assert.equal(actual.getMilliseconds(), 0)
  })
})

describe('fromDateToISOString', () => {
  it('returns correct ISO string for a valid date', () => {
    const date = new Date('2024-05-23T15:30:00Z')
    assert.equal(fromDateToStringDate(date), '2024-05-23')
  })

  it('throws for an invalid date', () => {
    assert.throws(
      () => fromDateToStringDate(new Date('invalid-date')),
      /Invalid date/,
    )
  })

  it('throws for a non-Date object', () => {
    // @ts-expect-error purposely passing string
    assert.throws(() => fromDateToStringDate('2024-05-23'), /Invalid date/)
  })

  it('returns correct ISO string for a leap year date', () => {
    const date = new Date('2020-02-29T23:59:59Z')
    assert.equal(fromDateToStringDate(date), '2020-02-29')
  })
})

describe('extractDateFromISODateString', () => {
  it('returns YYYY-MM-DD for a valid ISO string', () => {
    assert.equal(
      extractDateFromISODateString('2025-05-23T15:30:00.000Z'),
      '2025-05-23',
    )
  })

  it('throws for string shorter than 10 chars', () => {
    assert.throws(
      () => extractDateFromISODateString('2025-05'),
      /Invalid ISO date string/,
    )
  })

  it('throws for string not matching YYYY-MM-DD', () => {
    assert.throws(
      () => extractDateFromISODateString('2025-5-23T00:00:00Z'),
      /Invalid ISO date string/,
    )
    assert.throws(
      () => extractDateFromISODateString('abcd-ef-ghT00:00:00Z'),
      /Invalid ISO date string/,
    )
  })

  it('returns correct date for valid ISO string with time', () => {
    assert.equal(
      extractDateFromISODateString('2024-12-31T23:59:59.999Z'),
      '2024-12-31',
    )
  })
})
