import { assert, describe, it } from 'poku'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { normalizeFilterValue } from './normalize-filter-value'

describe('normalizeFilterValue', () => {
  it('should return undefined when value is ALL_VALUE', () => {
    const result = normalizeFilterValue(ALL_VALUE)
    assert(result === undefined)
  })

  it('should return the original value when value is not ALL_VALUE', () => {
    const testValue = 'Route'
    const result = normalizeFilterValue(testValue)
    assert(result === testValue)
  })

  it('should work with different string types', () => {
    const grade = '7a'
    const style = 'Onsight'
    const crag = 'Fontainebleau'

    assert(normalizeFilterValue(grade) === grade)
    assert(normalizeFilterValue(style) === style)
    assert(normalizeFilterValue(crag) === crag)
  })

  it('should handle empty string correctly', () => {
    const emptyString = ''
    const result = normalizeFilterValue(emptyString)
    assert(result === emptyString)
  })
})
