import { describe, expect, it } from 'vitest'
import type { StringDate } from '~/types/generic'
import {
  defaultTransform,
  groupDataByYear,
  transformToCalendarEntries,
} from './helpers'

// Test constants
const TEST_YEAR = 2024
const PREVIOUS_YEAR = 2023
const EXPECTED_TWO_ITEMS = 2
const EXPECTED_ONE_ITEM = 1
const EXPECTED_THREE_ITEMS = 3
const EXPECTED_EMPTY = 0
const JANUARY_DAY_ONE = 0
const JANUARY_DAY_TWO = 1
const DECEMBER_DAY_INDEX = 364 // Day 365 in non-leap year (0-based)

describe('DataCalendar Helpers', () => {
  describe('groupDataByYear', () => {
    it('should group data by year and day', () => {
      const data: StringDate[] = [
        { date: '2024-01-01T12:00:00.000Z' },
        { date: '2024-01-01T13:00:00.000Z' },
        { date: '2024-01-02T12:00:00.000Z' },
        { date: '2023-12-31T12:00:00.000Z' },
      ]

      const result = groupDataByYear(data)

      // Should have both years
      expect(result?.[TEST_YEAR]).toBeTruthy()
      expect(result?.[PREVIOUS_YEAR]).toBeTruthy()

      // 2024 should have 2 items on day 1 (index 0) and 1 item on day 2 (index 1)
      expect(result?.[TEST_YEAR]?.[JANUARY_DAY_ONE]?.length).toBe(
        EXPECTED_TWO_ITEMS,
      )
      expect(result?.[TEST_YEAR]?.[JANUARY_DAY_TWO]?.length).toBe(
        EXPECTED_ONE_ITEM,
      )

      // 2023 should have 1 item on last day (index 364 for non-leap year)
      expect(result?.[PREVIOUS_YEAR]?.[DECEMBER_DAY_INDEX]?.length).toBe(
        EXPECTED_ONE_ITEM,
      )
    })

    it('should handle empty data', () => {
      const result = groupDataByYear([])
      expect(result).toEqual({})
    })
  })

  describe('transformToCalendarEntries', () => {
    it('should transform grouped data to calendar entries', () => {
      const mockData = [
        [{ date: '2024-01-01T12:00:00.000Z' }],
        [],
        [{ date: '2024-01-03T12:00:00.000Z' }],
      ]

      const renderDay = (data: StringDate[]) =>
        data.length > 0 ? 'Has data' : 'Empty'

      const result = transformToCalendarEntries(TEST_YEAR, mockData, renderDay)

      expect(result.length).toBe(EXPECTED_THREE_ITEMS)
      expect(result?.[0]?.content).toBe('Has data')
      expect(result?.[1]?.content).toBe('Empty')
      expect(result?.[2]?.content).toBe('Has data')
    })

    it('should handle empty days', () => {
      const mockData = [[], []]
      const renderDay = () => 'Empty'
      const result = transformToCalendarEntries(TEST_YEAR, mockData, renderDay)

      expect(result.length).toBe(EXPECTED_TWO_ITEMS)
      expect(result?.[0]?.content).toBe('Empty')
      expect(result?.[1]?.content).toBe('Empty')
    })
  })

  describe('defaultTransform', () => {
    it('should transform data using default transformation', () => {
      const data: StringDate[] = [
        { date: '2024-01-01T12:00:00.000Z' },
        { date: '2024-01-02T12:00:00.000Z' },
      ]

      const renderDay = (d: StringDate[]) => d.length.toString()

      const result = defaultTransform(TEST_YEAR, data, renderDay)

      // Should have entries for all days of the year
      expect(result.length).toBeGreaterThan(EXPECTED_EMPTY)

      // First day should have content of '1'
      expect(result?.[0]?.content).toBe('1')

      // Second day should have content of '1'
      expect(result?.[1]?.content).toBe('1')
    })
  })
})
