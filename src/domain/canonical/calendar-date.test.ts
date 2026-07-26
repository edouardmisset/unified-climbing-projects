import { describe, expect, it } from 'vitest'
import { toParisCalendarDate } from './calendar-date'

describe('toParisCalendarDate', () => {
  it('keeps an existing calendar date unchanged', () => {
    expect(toParisCalendarDate('2024-02-29')).toBe('2024-02-29')
  })

  it.each([
    ['2024-03-31T21:30:00.000Z', '2024-03-31'],
    ['2024-03-31T22:30:00.000Z', '2024-04-01'],
    ['2024-10-27T22:30:00.000Z', '2024-10-27'],
    ['2024-10-27T23:30:00.000Z', '2024-10-28'],
  ])('converts %s to the Europe/Paris date %s', (timestamp, expectedDate) => {
    expect(toParisCalendarDate(timestamp)).toBe(expectedDate)
  })

  it('rejects an invalid legacy date', () => {
    expect(() => toParisCalendarDate('not-a-date')).toThrow("Invalid legacy date 'not-a-date'")
  })
})
