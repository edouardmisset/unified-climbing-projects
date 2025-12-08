import { describe, expect, it } from 'vitest'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { normalizeFilterValue } from './normalize-filter-value'

describe('normalizeFilterValue', () => {
  it('should return undefined when value is ALL_VALUE', () => {
    const result = normalizeFilterValue(ALL_VALUE)
    expect(result).toBe(undefined)
  })

  it('should return the original value when value is not ALL_VALUE', () => {
    const testValue = 'Route'
    const result = normalizeFilterValue(testValue)
    expect(result).toBe(testValue)
  })

  it('should work with different string types', () => {
    const grade = '7a'
    const style = 'Onsight'
    const crag = 'Fontainebleau'

    expect(normalizeFilterValue(grade)).toBe(grade)
    expect(normalizeFilterValue(style)).toBe(style)
    expect(normalizeFilterValue(crag)).toBe(crag)
  })

  it('should handle empty string correctly', () => {
    const emptyString = ''
    const result = normalizeFilterValue(emptyString)
    expect(result).toBe(emptyString)
  })
})
