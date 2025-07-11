import { assert, describe, it } from 'poku'
import type { StringDate } from '~/types/generic'
import { defaultTransform, groupDataByYear, transformToCalendarEntries } from './helpers'
import type { DataTransformConfig } from './types'

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
      assert.ok(result[TEST_YEAR])
      assert.ok(result[PREVIOUS_YEAR])
      
      // 2024 should have 2 items on day 1 (index 0) and 1 item on day 2 (index 1)
      assert.equal(result[TEST_YEAR][JANUARY_DAY_ONE].length, EXPECTED_TWO_ITEMS)
      assert.equal(result[TEST_YEAR][JANUARY_DAY_TWO].length, EXPECTED_ONE_ITEM)
      
      // 2023 should have 1 item on last day (index 364 for non-leap year)
      assert.equal(result[PREVIOUS_YEAR][DECEMBER_DAY_INDEX].length, EXPECTED_ONE_ITEM)
    })
    
    it('should handle empty data', () => {
      const result = groupDataByYear([])
      assert.deepEqual(result, {})
    })
  })
  
  describe('transformToCalendarEntries', () => {
    it('should transform grouped data to calendar entries', () => {
      const mockData = [
        [{ date: '2024-01-01T12:00:00.000Z' }],
        [],
        [{ date: '2024-01-03T12:00:00.000Z' }],
      ]
      
      const config: DataTransformConfig<StringDate> = {
        getShortText: (data) => data.length > 0 ? 'X' : '',
        getTitle: (data) => data.length > 0 ? 'Has data' : '',
      }
      
      const result = transformToCalendarEntries(TEST_YEAR, mockData, config)
      
      assert.equal(result.length, EXPECTED_THREE_ITEMS)
      assert.equal(result[0].shortText, 'X')
      assert.equal(result[0].title, 'Has data')
      assert.equal(result[1].shortText, '')
      assert.equal(result[2].shortText, 'X')
    })
    
    it('should handle empty days', () => {
      const mockData = [[], []]
      const result = transformToCalendarEntries(TEST_YEAR, mockData)
      
      assert.equal(result.length, EXPECTED_TWO_ITEMS)
      assert.equal(result[0].shortText, '')
      assert.equal(result[1].shortText, '')
    })
  })
  
  describe('defaultTransform', () => {
    it('should transform data using default transformation', () => {
      const data: StringDate[] = [
        { date: '2024-01-01T12:00:00.000Z' },
        { date: '2024-01-02T12:00:00.000Z' },
      ]
      
      const config: DataTransformConfig<StringDate> = {
        getShortText: (data) => data.length.toString(),
      }
      
      const result = defaultTransform(TEST_YEAR, data, config)
      
      // Should have entries for all days of the year
      assert.ok(result.length > EXPECTED_EMPTY)
      
      // First day should have shortText of '1'
      assert.equal(result[0].shortText, '1')
      
      // Second day should have shortText of '1'
      assert.equal(result[1].shortText, '1')
    })
  })
})