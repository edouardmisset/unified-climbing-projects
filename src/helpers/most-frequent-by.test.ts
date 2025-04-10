import { assert, describe, it } from 'poku'
import { mostFrequentBy } from './most-frequent-by'

describe('mostFrequentBy', () => {
  it('should return undefined for an empty array', () => {
    const result = mostFrequentBy([], 'property')
    assert.equal(result, undefined)
  })

  it('should return the property value for an array with one record', () => {
    const records = [{ property: 'value' }]
    const result = mostFrequentBy(records, 'property')
    assert.equal(result, 'value')
  })

  it('should return the most frequent value for a property', () => {
    const records = [
      { property: 'a' },
      { property: 'b' },
      { property: 'a' },
      { property: 'c' },
      { property: 'a' },
    ]
    const result = mostFrequentBy(records, 'property')
    assert.equal(result, 'a')
  })

  it('should return the first most frequent value in case of a tie', () => {
    const records = [
      { property: 'a' },
      { property: 'b' },
      { property: 'a' },
      { property: 'b' },
    ]
    const result = mostFrequentBy(records, 'property')
    assert.equal(result, 'a') // 'a' appears first
  })

  it('should skip records with undefined property values', () => {
    const records = [
      { property: 'a' },
      { property: undefined },
      { property: undefined },
      { property: undefined },
      { property: 'a' },
      { property: 'b' },
    ]
    const result = mostFrequentBy(records, 'property')
    assert.equal(result, 'a')
  })

  it('should handle mixed data types for property values', () => {
    const records = [
      { property: 1 },
      { property: '1' },
      { property: 1 },
      { property: '1' },
      { property: 1 },
    ]
    const result = mostFrequentBy(records, 'property')
    assert.equal(result, 1)
  })

  it('should return undefined if all property values are undefined', () => {
    const records = [{ property: undefined }, { property: undefined }]
    const result = mostFrequentBy(records, 'property')
    assert.equal(result, undefined)
  })

  it('should handle objects with missing properties gracefully', () => {
    const records = [{ otherProperty: 'a' }, { otherProperty: 'b' }]
    // @ts-expect-error: Intentionally testing behavior when the specified property is missing
    const result = mostFrequentBy(records, 'property')
    assert.equal(result, undefined)
  })
})
