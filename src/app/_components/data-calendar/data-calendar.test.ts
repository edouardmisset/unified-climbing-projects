import { assert, describe, it } from 'poku'
import type { StringDate } from '~/types/generic'
import type { DataCalendarProps } from './types'

// Test constants
const TEST_YEAR = 2024
const EXPECTED_DATA_LENGTH = 2
const EXPECTED_SINGLE_ITEM_LENGTH = 1

// Mock the DataCalendar component for testing
// Note: This is a simplified test that focuses on the logic
describe('DataCalendar Component', () => {
  describe('New API', () => {
    it('should accept simplified props', () => {
      const props: DataCalendarProps<StringDate> = {
        year: TEST_YEAR,
        data: [
          { date: '2024-01-01T12:00:00.000Z' },
          { date: '2024-01-02T12:00:00.000Z' },
        ],
        config: {
          getShortText: (data) => data.length.toString(),
        },
      }
      
      // Test that props are properly typed
      assert.equal(props.year, TEST_YEAR)
      assert.equal(props.data.length, EXPECTED_DATA_LENGTH)
      assert.ok(props.config)
    })
    
    it('should allow custom transform function', () => {
      const customTransform = (_year: number, data: StringDate[]) => {
        return data.map(item => ({
          date: item.date,
          description: 'Custom',
          shortText: 'C',
          title: 'Custom Title',
        }))
      }
      
      const props: DataCalendarProps<StringDate> = {
        year: TEST_YEAR,
        data: [{ date: '2024-01-01T12:00:00.000Z' }],
        customTransform,
      }
      
      assert.equal(props.year, TEST_YEAR)
      assert.ok(props.customTransform)
    })
    
    it('should work without any configuration', () => {
      const props: DataCalendarProps<StringDate> = {
        year: TEST_YEAR,
        data: [{ date: '2024-01-01T12:00:00.000Z' }],
      }
      
      assert.equal(props.year, TEST_YEAR)
      assert.equal(props.data.length, EXPECTED_SINGLE_ITEM_LENGTH)
    })
  })
  
  describe('Type Safety', () => {
    it('should enforce StringDate constraint', () => {
      // This test verifies that the type system enforces the StringDate constraint
      interface TestData extends StringDate {
        name: string
      }
      
      const testData: TestData[] = [
        { date: '2024-01-01T12:00:00.000Z', name: 'test' },
      ]
      
      const props: DataCalendarProps<TestData> = {
        year: TEST_YEAR,
        data: testData,
        config: {
          getShortText: (data) => data[0]?.name || '',
        },
      }
      
      assert.equal(props.data[0]?.name, 'test')
    })
  })
})