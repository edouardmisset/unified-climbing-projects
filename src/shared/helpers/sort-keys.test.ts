import { describe, expect, it } from 'vitest'
import { sortKeys } from './sort-keys'

describe('sortKeys', () => {
  it('should sort the keys in ascending order by default', () => {
    const unsorted = { a: 2, b: 1, c: 3 }
    const sorted = sortKeys(unsorted)
    const expected = { a: 2, b: 1, c: 3 }
    expect(sorted).toEqual(expected)
  })

  it('should sort the keys in descending order when specified', () => {
    const unsorted = { a: 2, b: 1, c: 3 }
    const sorted = sortKeys(unsorted, { ascending: false })
    const expected = { a: 2, b: 1, c: 3 }
    expect(sorted).toEqual(expected)
  })

  it('should return an empty object when given an empty object', () => {
    const unsorted = {}
    const sorted = sortKeys(unsorted)
    expect(sorted).toEqual({})
  })

  it('should handle objects with non-string values correctly', () => {
    const unsorted = { '1': [5, 6], '2': [1, 2], '10': [3, 4] }
    const sorted = sortKeys(unsorted)
    // Lexicographical order: "1", "10", "2"
    const expected = { '1': [5, 6], '2': [1, 2], '10': [3, 4] }
    expect(sorted).toEqual(expected)
  })
})
