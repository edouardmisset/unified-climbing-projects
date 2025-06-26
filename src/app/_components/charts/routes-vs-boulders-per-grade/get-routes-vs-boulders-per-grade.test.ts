import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import { getRoutesVsBouldersPerGrade } from './get-routes-vs-boulders-per-grade'

describe('getRoutesVsBouldersPerYear', () => {
  it('should return empty array for empty input', () => {
    const result = getRoutesVsBouldersPerGrade([])
    assert.deepEqual(result, [])
  })

  it('should return correct structure and counts based on sample data', () => {
    const expected = [
      {
        Boulder: 1,
        BoulderColor: 'var(--boulder)',
        grade: '7a',
        Route: 6,
        RouteColor: 'var(--route)',
      },
      {
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        grade: '7a+',
        Route: 4,
        RouteColor: 'var(--route)',
      },
      {
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        grade: '7b',
        Route: 5,
        RouteColor: 'var(--route)',
      },
      {
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        grade: '7b+',
        Route: 1,
        RouteColor: 'var(--route)',
      },
      {
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        grade: '7c',
        Route: 1,
        RouteColor: 'var(--route)',
      },
      {
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        grade: '7c+',
        Route: 1,
        RouteColor: 'var(--route)',
      },
      {
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        grade: '8a',
        Route: 0,
        RouteColor: 'var(--route)',
      },
      {
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        grade: '8a+',
        Route: 1,
        RouteColor: 'var(--route)',
      },
    ]
    const result = getRoutesVsBouldersPerGrade(
      sampleAscents.filter(({ date }) => new Date(date).getFullYear() === 2024),
    )
    assert.deepEqual(result, expected)
  })
})
