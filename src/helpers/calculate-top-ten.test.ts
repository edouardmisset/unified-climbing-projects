import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import type { Ascent } from '~/schema/ascent'
import { fromAscentToPoints } from './ascent-converter'
import { calculateTopTenScore } from './calculate-top-ten'

describe('calculateTopTenScore', () => {
  it('should return 0 for empty array', () => {
    const result = calculateTopTenScore([])
    assert.equal(result, 0)
  })

  it('should sum all points if fewer than 10 ascents', () => {
    // Create a small set of test ascents
    const fewAscents = sampleAscents.slice(0, 5)

    // Calculate expected score manually
    const expectedTotal = fewAscents
      .map(ascent => fromAscentToPoints(ascent))
      .reduce((sum, points) => sum + points, 0)

    const result = calculateTopTenScore(fewAscents)

    assert.equal(result, expectedTotal)
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

    assert.equal(result, expectedTotal)
  })

  it('should correctly handle ascents with different point values', () => {
    // Create mock ascents with known point values
    const mockAscents = [
      {
        climbingDiscipline: 'Route',
        date: new Date().toISOString(),
        id: 1,
        style: 'Redpoint',
        topoGrade: '5c',
      },
      {
        climbingDiscipline: 'Route',
        date: new Date().toISOString(),
        id: 2,
        style: 'Onsight',
        topoGrade: '7a',
      },
      {
        climbingDiscipline: 'Boulder',
        date: new Date().toISOString(),
        id: 3,
        style: 'Flash',
        topoGrade: '6a',
      },
    ] as Ascent[]

    const result = calculateTopTenScore(mockAscents)

    // Calculate expected manually
    const expectedTotal = mockAscents
      .map(ascent => fromAscentToPoints(ascent))
      .sort((a, b) => b - a)
      .slice(0, 10)
      .reduce((sum, points) => sum + points, 0)

    assert.equal(result, expectedTotal)
  })
})
