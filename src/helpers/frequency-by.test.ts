import { assert, describe, it } from 'poku'
import { frequencyBy } from './frequency-by'

describe('frequencyBy', () => {
  it('should count frequencies for string keys without sorting when ascending undefined', () => {
    const items = [
      { category: 'a' },
      { category: 'b' },
      { category: 'a' },
      { category: 'c' },
    ]
    const result = frequencyBy(items, 'category')
    // distinct keys in insertion order: 'a', 'b', 'c'
    assert.deepEqual(result, { a: 2, b: 1, c: 1 })
  })

  it('should count frequencies and sort in ascending order when ascending is true', () => {
    const items = [
      { type: 'x' },
      { type: 'y' },
      { type: 'x' },
      { type: 'z' },
      { type: 'x' },
      { type: 'y' },
    ]
    const result = frequencyBy(items, 'type', { ascending: true })
    // frequencies: x:3, y:2, z:1
    // expect sorted ascending by count: z, y, x.
    assert.deepEqual(result, { z: 1, y: 2, x: 3 })
  })

  it('should count frequencies and sort in descending order when ascending is false', () => {
    const items = [
      { type: 'x' },
      { type: 'y' },
      { type: 'x' },
      { type: 'z' },
      { type: 'x' },
      { type: 'y' },
    ]
    const result = frequencyBy(items, 'type', { ascending: false })
    // frequencies: x:3, y:2, z:1
    // expect sorted descending by count: x, y, z.
    assert.deepEqual(result, { x: 3, y: 2, z: 1 })
  })

  it('should work correctly with numeric keys', () => {
    const items = [{ num: 1 }, { num: 2 }, { num: 1 }, { num: 3 }, { num: 2 }]
    // Without sort options: insertion order from first distinct encounter: 1, 2, 3.
    const result = frequencyBy(items, 'num')
    assert.deepEqual(result, { 1: 2, 2: 2, 3: 1 })

    // With ascending sorting.
    const resultAsc = frequencyBy(items, 'num', { ascending: true })
    // Expected order by count ascending: num=3 (1 occurrence), then 1 and 2 (2 occurrences each).
    // Since 1 appears before 2 in the original set, order should be: 3, 1, 2.
    assert.deepEqual(resultAsc, { 3: 1, 1: 2, 2: 2 })
  })

  it('should return an empty object when given an empty array', () => {
    const result = frequencyBy([], 'anyKey')
    assert.deepEqual(result, {})
  })
})
