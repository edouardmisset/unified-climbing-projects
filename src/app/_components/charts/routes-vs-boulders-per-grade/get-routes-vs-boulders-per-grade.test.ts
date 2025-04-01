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
        grade: '7a',
        Boulder: 1,
        BoulderColor: 'var(--boulder)',
        Route: 6,
        RouteColor: 'var(--route)',
      },
      {
        grade: '7a+',
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        Route: 4,
        RouteColor: 'var(--route)',
      },
      {
        grade: '7b',
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        Route: 5,
        RouteColor: 'var(--route)',
      },
      {
        grade: '7b+',
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        Route: 1,
        RouteColor: 'var(--route)',
      },
      {
        grade: '7c',
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        Route: 1,
        RouteColor: 'var(--route)',
      },
      {
        grade: '7c+',
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        Route: 1,
        RouteColor: 'var(--route)',
      },
      {
        grade: '8a',
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
        Route: 0,
        RouteColor: 'var(--route)',
      },
      {
        grade: '8a+',
        Boulder: 0,
        BoulderColor: 'var(--boulder)',
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
