import { assert, describe, it } from 'poku'
import { addParenthesis } from './add-parenthesis'

describe('addParenthesis', () => {
  it('should return an empty string when the input is zero', () => {
    const result = addParenthesis(0)
    assert.equal(result, '')
  })
  it('should return an empty string when the input is negative', () => {
    const result = addParenthesis(-10)
    assert.equal(result, '')
  })
  it('should wrap a positive number in parentheses', () => {
    const result = addParenthesis(5)
    assert.equal(result, '(5)')
  })
  it('should handle large numbers correctly', () => {
    const result = addParenthesis(987_654_321)
    assert.equal(result, '(987654321)')
  })
})
