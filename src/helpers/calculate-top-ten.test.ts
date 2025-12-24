import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import {
  type Ascent,
  BOULDERING,
  FLASH,
  ONSIGHT,
  REDPOINT,
  SPORT,
} from '~/schema/ascent'
import { fromAscentToPoints } from './ascent-converter'
import { calculateTopTenScore } from './calculate-top-ten'

describe('calculateTopTenScore', () => {
  it('should return 0 for empty array', () => {
    const result = calculateTopTenScore([])
    expect(result).toBe(0)
  })

  it('should sum all points if fewer than 10 ascents', () => {
    // Create a small set of test ascents
    const fewAscents = sampleAscents.slice(0, 5)

    // Calculate expected score manually
    const expectedTotal = fewAscents
      .map(ascent => fromAscentToPoints(ascent))
      .reduce((sum, points) => sum + points, 0)

    const result = calculateTopTenScore(fewAscents)

    expect(result).toBe(expectedTotal)
  })

  it('should sum only the top 10 scores if more than 10 ascents', () => {
    // Create test data with more than 10 ascents
    const manyAscents = sampleAscents.slice(0, 15)

    // Calculate top 10 scores manually
    const expectedTotal = manyAscents
      .map(ascent => fromAscentToPoints(ascent))
      .sort((a, b) => b - a)
      .slice(0, 10)
      .reduce((sum, points) => sum + points, 0)

    const result = calculateTopTenScore(manyAscents)

    expect(result).toBe(expectedTotal)
  })

  it('should correctly handle ascents with different point values', () => {
    // Create mock ascents with known point values
    const mockAscents = [
      {
        discipline: SPORT,
        date: new Date().toISOString(),
        _id: '1',
        style: REDPOINT,
        grade: '5c',
      },
      {
        discipline: SPORT,
        date: new Date().toISOString(),
        _id: '2',
        style: ONSIGHT,
        grade: '7a',
      },
      {
        discipline: BOULDERING,
        date: new Date().toISOString(),
        _id: '3',
        style: FLASH,
        grade: '6a',
      },
    ] as Ascent[]

    const result = calculateTopTenScore(mockAscents)

    // Calculate expected manually
    const expectedTotal = mockAscents
      .map(ascent => fromAscentToPoints(ascent))
      .sort((a, b) => b - a)
      .slice(0, 10)
      .reduce((sum, points) => sum + points, 0)

    expect(result).toBe(expectedTotal)
  })
})
