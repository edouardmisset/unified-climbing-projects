import { assert, describe, it } from 'poku'
import { formatDateTime } from './format-date'

describe('formatDateTime', () => {
  it('should format the date correctly with longDateTime option', () => {
    const date = new Date(2024, 0, 20, 10, 30, 0)
    const result = formatDateTime(date, 'longDateTime')
    assert.equal(result, 'January 20, 2024 at 10:30:00 AM')
  })

  it('should format the date correctly with shortDate option', () => {
    const date = new Date(2024, 0, 20, 10, 30, 0)
    const result = formatDateTime(date, 'shortDate')
    assert.equal(result, '20/01/24')
  })
})
