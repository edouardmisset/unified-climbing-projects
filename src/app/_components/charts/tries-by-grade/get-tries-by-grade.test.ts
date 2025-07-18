import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import { getTriesByGrade } from './get-tries-by-grade'

describe('getTriesByGrade', () => {
  it('should return empty array for empty input', () => {
    const result = getTriesByGrade([])
    assert.deepEqual(result, [])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        color: 'var(--min-tries)',
        data: [
          {
            x: '7a',
            y: 1,
          },
          {
            x: '7a+',
            y: 1,
          },
          {
            x: '7b',
            y: 1,
          },
          {
            x: '7b+',
            y: 1,
          },
          {
            x: '7c',
            y: 1,
          },
          {
            x: '7c+',
            y: 1,
          },
          {
            x: '8a+',
            y: 2,
          },
          {
            x: '8b',
            y: 10,
          },
          {
            x: '8b+',
            y: 10,
          },
        ],
        id: 'min',
      },
      {
        color: 'var(--average-tries)',
        data: [
          {
            x: '7a',
            y: 2,
          },
          {
            x: '7a+',
            y: 2,
          },
          {
            x: '7b',
            y: 1,
          },
          {
            x: '7b+',
            y: 1,
          },
          {
            x: '7c',
            y: 3,
          },
          {
            x: '7c+',
            y: 3,
          },
          {
            x: '8a+',
            y: 6,
          },
          {
            x: '8b',
            y: 10,
          },
          {
            x: '8b+',
            y: 10,
          },
        ],
        id: 'average',
      },
      {
        color: 'var(--max-tries)',
        data: [
          {
            x: '7a',
            y: 15,
          },
          {
            x: '7a+',
            y: 10,
          },
          {
            x: '7b',
            y: 2,
          },
          {
            x: '7b+',
            y: 2,
          },
          {
            x: '7c',
            y: 5,
          },
          {
            x: '7c+',
            y: 10,
          },
          {
            x: '8a+',
            y: 10,
          },
          {
            x: '8b',
            y: 10,
          },
          {
            x: '8b+',
            y: 10,
          },
        ],
        id: 'max',
      },
    ]
    const result = getTriesByGrade(sampleAscents)
    assert.deepEqual(result, expected)
  })
})
