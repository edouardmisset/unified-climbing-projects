import { describe, expect, it } from 'vitest'
import {
  extractDateFromISODateString,
  findLongestGap,
  findLongestStreak,
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

const INVALID_DATE_REGEX = /Invalid date/
const INVALID_ISO_DATE_STRING_REGEX = /Invalid ISO date string/

describe('getWeekNumber', () => {
  it('should return the correct week number for a given date', () => {
    const date = new Date(2024, 0, 20)
    const result = getWeekNumber(date)
    expect(result).toBe(4)
  })
})

describe('getWeeksInYear', () => {
  it('should return the correct number of weeks in a year', () => {
    const year = 2023
    const result = getWeeksInYear(year)
    expect(result).toBe(52)
  })
})

describe('getDaysInYear', () => {
  it('should return the correct number of days in a non-leap year', () => {
    const year = 2023
    const result = getDaysInYear(year)
    expect(result).toBe(365)
  })

  it('should return the correct number of days in a leap year', () => {
    const year = 2024
    const result = getDaysInYear(year)
    expect(result).toBe(366)
  })
})

describe('getDayOfYear', () => {
  it('should return the correct day of the year for a given date', () => {
    const date = new Date(2024, 5, 20)
    const result = getDayOfYear(date)
    expect(result).toBe(171)
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
    expect(result).toEqual(['2024-01-03', 3])
  })

  it('should return a default value when the input array is empty', () => {
    const result = getMostFrequentDate([])
    expect(result).toEqual(['', 0])
  })
})

describe('getYesterday', () => {
  it('should return yesterday at noon (relative to now)', () => {
    const today = new Date()
    const expected = new Date(today)
    expected.setDate(today.getDate() - 1)
    expected.setHours(12, 0, 0, 0)
    const actual = getYesterday()
    expect(actual.getFullYear()).toBe(expected.getFullYear())
    expect(actual.getMonth()).toBe(expected.getMonth())
    expect(actual.getDate()).toBe(expected.getDate())
    expect(actual.getHours()).toBe(12)
    expect(actual.getMinutes()).toBe(0)
    expect(actual.getSeconds()).toBe(0)
    expect(actual.getMilliseconds()).toBe(0)
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
    expect(actual.getFullYear()).toBe(expected.getFullYear())
    expect(actual.getMonth()).toBe(expected.getMonth())
    expect(actual.getDate()).toBe(expected.getDate())
    expect(actual.getHours()).toBe(12)
    expect(actual.getMinutes()).toBe(0)
    expect(actual.getSeconds()).toBe(0)
    expect(actual.getMilliseconds()).toBe(0)
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
    expect(actual.getFullYear()).toBe(expected.getFullYear())
    expect(actual.getMonth()).toBe(expected.getMonth())
    expect(actual.getDate()).toBe(expected.getDate())
    expect(actual.getHours()).toBe(12)
    expect(actual.getMinutes()).toBe(0)
    expect(actual.getSeconds()).toBe(0)
    expect(actual.getMilliseconds()).toBe(0)
  })
})

describe('fromDateToISOString', () => {
  it('returns correct ISO string for a valid date', () => {
    const date = new Date('2024-05-23T15:30:00Z')
    expect(fromDateToStringDate(date)).toBe('2024-05-23')
  })

  it('throws for an invalid date', () => {
    expect(() => fromDateToStringDate(new Date('invalid-date'))).toThrow(
      INVALID_DATE_REGEX,
    )
  })

  it('throws for a non-Date object', () => {
    // @ts-expect-error purposely passing string
    expect(() => fromDateToStringDate('2024-05-23')).toThrow(INVALID_DATE_REGEX)
  })

  it('returns correct ISO string for a leap year date', () => {
    const date = new Date('2020-02-29T23:59:59Z')
    expect(fromDateToStringDate(date)).toBe('2020-02-29')
  })
})

describe('extractDateFromISODateString', () => {
  it('returns YYYY-MM-DD for a valid ISO string', () => {
    expect(extractDateFromISODateString('2025-05-23T15:30:00.000Z')).toBe(
      '2025-05-23',
    )
  })

  it('throws for string shorter than 10 chars', () => {
    expect(() => extractDateFromISODateString('2025-05')).toThrow(
      INVALID_ISO_DATE_STRING_REGEX,
    )
  })

  it('throws for string not matching YYYY-MM-DD', () => {
    expect(() => extractDateFromISODateString('2025-5-23T00:00:00Z')).toThrow(
      INVALID_ISO_DATE_STRING_REGEX,
    )
    expect(() => extractDateFromISODateString('2025-5-23T00:00:00Z')).toThrow(
      INVALID_ISO_DATE_STRING_REGEX,
    )
    expect(() => extractDateFromISODateString('abcd-ef-ghT00:00:00Z')).toThrow(
      INVALID_ISO_DATE_STRING_REGEX,
    )
  })

  it('returns correct date for valid ISO string with time', () => {
    expect(extractDateFromISODateString('2024-12-31T23:59:59.999Z')).toBe(
      '2024-12-31',
    )
  })
})

describe('findLongestStreak', () => {
  it('should return 0 for empty array', () => {
    const result = findLongestStreak([])
    expect(result).toBe(0)
  })

  it('should return 1 for single date', () => {
    const data = [{ date: '2024-01-01' }]
    const result = findLongestStreak(data)
    expect(result).toBe(1)
  })

  it('should find longest streak in consecutive dates', () => {
    const data = [
      { date: '2024-01-01' },
      { date: '2024-01-02' },
      { date: '2024-01-03' },
      { date: '2024-01-04' },
    ]
    const result = findLongestStreak(data)
    expect(result).toBe(4)
  })

  it('should handle gaps in dates correctly', () => {
    const data = [
      { date: '2024-01-01' },
      { date: '2024-01-02' },
      { date: '2024-01-04' }, // Gap here
      { date: '2024-01-05' },
      { date: '2024-01-06' },
    ]
    const result = findLongestStreak(data)
    expect(result).toBe(3) // Longest streak is days 4, 5, 6
  })

  it('should deduplicate dates on same day', () => {
    const data = [
      { date: '2024-01-01' },
      { date: '2024-01-01' }, // Duplicate
      { date: '2024-01-02' },
      { date: '2024-01-02' }, // Duplicate
      { date: '2024-01-03' },
    ]
    const result = findLongestStreak(data)
    expect(result).toBe(3)
  })

  it('should handle unsorted dates', () => {
    const data = [
      { date: '2024-01-03' },
      { date: '2024-01-01' },
      { date: '2024-01-02' },
      { date: '2024-01-05' },
      { date: '2024-01-04' },
    ]
    const result = findLongestStreak(data)
    expect(result).toBe(5)
  })

  it('should handle multiple separate streaks', () => {
    const data = [
      { date: '2024-01-01' },
      { date: '2024-01-02' },
      { date: '2024-01-05' }, // Gap
      { date: '2024-01-06' },
      { date: '2024-01-07' },
      { date: '2024-01-08' },
    ]
    const result = findLongestStreak(data)
    expect(result).toBe(4) // Days 5, 6, 7, 8
  })

  it('should handle month boundaries correctly', () => {
    const data = [
      { date: '2024-01-30' },
      { date: '2024-01-31' },
      { date: '2024-02-01' },
      { date: '2024-02-02' },
    ]
    const result = findLongestStreak(data)
    expect(result).toBe(4)
  })

  it('should handle year boundaries correctly', () => {
    const data = [
      { date: '2023-12-30' },
      { date: '2023-12-31' },
      { date: '2024-01-01' },
      { date: '2024-01-02' },
    ]
    const result = findLongestStreak(data)
    expect(result).toBe(4)
  })

  it('should handle leap year correctly', () => {
    const data = [
      { date: '2024-02-28' },
      { date: '2024-02-29' }, // Leap day
      { date: '2024-03-01' },
    ]
    const result = findLongestStreak(data)
    expect(result).toBe(3)
  })

  it('should return 0 for all invalid dates', () => {
    const data = [
      { date: 'invalid-date' },
      { date: '2024-13-01' }, // Invalid month
    ]
    const result = findLongestStreak(data)
    expect(result).toBe(0)
  })

  it('should filter out invalid dates and process valid ones', () => {
    const data = [
      { date: '2024-01-01' },
      { date: 'invalid-date' },
      { date: '2024-01-02' },
      { date: '2024-13-01' }, // Invalid month
      { date: '2024-01-03' },
    ]
    const result = findLongestStreak(data)
    expect(result).toBe(3)
  })

  it('should work with objects containing additional properties', () => {
    const data = [
      { date: '2024-01-01', activity: 'climbing', grade: '5.10a' },
      { date: '2024-01-02', activity: 'bouldering', grade: 'V4' },
      { date: '2024-01-03', activity: 'climbing', grade: '5.11b' },
    ]
    const result = findLongestStreak(data)
    expect(result).toBe(3)
  })
})

describe('findLongestGap', () => {
  it('should return 0 for empty array', () => {
    const data: Array<{ date: string }> = []
    const result = findLongestGap(data)
    expect(result).toBe(0)
  })

  it('should return 0 for single date', () => {
    const data = [{ date: '2024-01-01' }]
    const result = findLongestGap(data)
    expect(result).toBe(0)
  })

  it('should return 0 for consecutive dates with no gaps', () => {
    const data = [
      { date: '2024-01-01' },
      { date: '2024-01-02' },
      { date: '2024-01-03' },
    ]
    const result = findLongestGap(data)
    expect(result).toBe(0)
  })

  it('should calculate gap correctly for simple case', () => {
    const data = [
      { date: '2024-01-01' },
      { date: '2024-01-05' }, // 3-day gap (Jan 2, 3, 4)
    ]
    const result = findLongestGap(data)
    expect(result).toBe(3)
  })

  it('should find the longest gap among multiple gaps', () => {
    const data = [
      { date: '2024-01-01' },
      { date: '2024-01-03' }, // 1-day gap (Jan 2)
      { date: '2024-01-10' }, // 6-day gap (Jan 4-9)
      { date: '2024-01-12' }, // 1-day gap (Jan 11)
      { date: '2024-01-17' }, // 4-day gap (Jan 13-16)
    ]
    const result = findLongestGap(data)
    expect(result).toBe(6)
  })

  it('should handle unsorted dates correctly', () => {
    const data = [
      { date: '2024-01-10' },
      { date: '2024-01-01' },
      { date: '2024-01-15' },
    ]
    const result = findLongestGap(data)
    expect(result).toBe(8)
  })

  it('should handle duplicate dates correctly', () => {
    const data = [
      { date: '2024-01-01' },
      { date: '2024-01-01' }, // Duplicate
      { date: '2024-01-05' }, // 3-day gap (Jan 2, 3, 4)
      { date: '2024-01-05' }, // Duplicate
    ]
    const result = findLongestGap(data)
    expect(result).toBe(3)
  })

  it('should handle month boundaries correctly', () => {
    const data = [
      { date: '2024-01-30' },
      { date: '2024-02-05' }, // 5-day gap (Jan 31, Feb 1-4)
    ]
    const result = findLongestGap(data)
    expect(result).toBe(5)
  })

  it('should handle year boundaries correctly', () => {
    const data = [
      { date: '2023-12-30' },
      { date: '2024-01-05' }, // 5-day gap (Dec 31, Jan 1-4)
    ]
    const result = findLongestGap(data)
    expect(result).toBe(5)
  })

  it('should handle leap year correctly', () => {
    const data = [
      { date: '2024-02-27' },
      { date: '2024-03-02' }, // 3-day gap (Feb 28, 29, Mar 1)
    ]
    const result = findLongestGap(data)
    expect(result).toBe(3)
  })

  it('should return 0 for all invalid dates', () => {
    const data = [
      { date: 'invalid-date' },
      { date: '2024-13-01' }, // Invalid month
    ]
    const result = findLongestGap(data)
    expect(result).toBe(0)
  })

  it('should filter out invalid dates and process valid ones', () => {
    const data = [
      { date: '2024-01-01' },
      { date: 'invalid-date' },
      { date: '2024-01-05' }, // 3-day gap (Jan 2, 3, 4)
      { date: '2024-13-01' }, // Invalid month
    ]
    const result = findLongestGap(data)
    expect(result).toBe(3)
  })

  it('should work with objects containing additional properties', () => {
    const data = [
      { date: '2024-01-01', activity: 'climbing', grade: '5.10a' },
      { date: '2024-01-08', activity: 'bouldering', grade: 'V4' }, // 6-day gap
    ]
    const result = findLongestGap(data)
    expect(result).toBe(6)
  })

  it('should handle large gaps correctly', () => {
    const data = [
      { date: '2024-01-01' },
      { date: '2024-12-31' }, // 364-day gap (entire year minus 1 day)
    ]
    const result = findLongestGap(data)
    expect(result).toBe(364)
  })
})
