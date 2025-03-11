import { assert, describe, it } from 'poku'
import { sortKeys } from './sort-keys'

describe('sortKeys', () => {
  it('should sort the keys in ascending order by default', () => {
    const unsorted = { b: 1, a: 2, c: 3 }
    const sorted = sortKeys(unsorted)
    const expected = { a: 2, b: 1, c: 3 }
    assert.deepEqual(sorted, expected)
  })

  it('should sort the keys in descending order when specified', () => {
    const unsorted = { b: 1, a: 2, c: 3 }
    const sorted = sortKeys(unsorted, { ascending: false })
    const expected = { c: 3, b: 1, a: 2 }
    assert.deepEqual(sorted, expected)
  })

  it('should return an empty object when given an empty object', () => {
    const unsorted = {}
    const sorted = sortKeys(unsorted)
    assert.deepEqual(sorted, {})
  })

  it('should handle objects with non-string values correctly', () => {
    const unsorted = { '2': [1, 2], '10': [3, 4], '1': [5, 6] }
    const sorted = sortKeys(unsorted)
    // Lexicographical order: "1", "10", "2"
    const expected = { '1': [5, 6], '10': [3, 4], '2': [1, 2] }
    assert.deepEqual(sorted, expected)
  })
})
