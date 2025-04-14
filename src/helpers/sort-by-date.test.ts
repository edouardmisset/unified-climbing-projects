import { assert, describe, it } from 'poku'
import { sortByDate } from './sort-by-date'

describe('sortByDate', () => {
  const dateA = { date: '2024-01-01', id: 1 }
  const dateB = { date: '2024-02-15', id: 2 }
  const dateC = { date: '2023-12-25', id: 3 }
  const equalDate1 = { date: '2024-03-10', id: 4 }
  const equalDate2 = { date: '2024-03-10', id: 5 }
  const invalidDate = { date: 'invalid-date', id: 6 }

  it('should sort dates in descending order by default (newest first)', () => {
    const unsortedArray = [dateA, dateB, dateC]
    const sortedArray = [...unsortedArray].sort(sortByDate)

    assert.deepEqual(
      sortedArray.map(item => item.id),
      [2, 1, 3], // dateB (Feb), dateA (Jan), dateC (Dec)
    )
  })

  it('should sort dates in ascending order when isDescending is false (oldest first)', () => {
    const unsortedArray = [dateA, dateB, dateC]
    const sortedArray = [...unsortedArray].sort((a, b) =>
      sortByDate(a, b, false),
    )

    assert.deepEqual(
      sortedArray.map(item => item.id),
      [3, 1, 2], // dateC (Dec), dateA (Jan), dateB (Feb)
    )
  })

  it('should return 0 for equal dates', () => {
    const result = sortByDate(equalDate1, equalDate2)
    assert.equal(result, 0)
  })

  it('should handle invalid dates by returning 0', () => {
    const result = sortByDate(dateA, invalidDate)

    assert.equal(result, 0)
  })

  it('should sort an array with multiple dates correctly', () => {
    const unsortedArray = [dateB, dateC, dateA, equalDate1, equalDate2]
    const sortedArray = [...unsortedArray].sort(sortByDate)

    // Expected order: equalDate1/2 (Mar), dateB (Feb), dateA (Jan), dateC (Dec)
    assert.deepEqual(
      sortedArray.map(item => item.id),
      [4, 5, 2, 1, 3],
    )
  })
})
