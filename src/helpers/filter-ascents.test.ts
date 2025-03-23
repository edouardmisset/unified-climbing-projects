import { assert, describe, it } from 'poku'
import { sampleAscents } from '~/backup/sample-ascents'
import {
  filterAscents,
  getCragsDetails,
  getHardestAscent,
} from './filter-ascents'

describe('filterAscents', () => {
  it('should return all ascents when no filters are provided', () => {
    const result = filterAscents(sampleAscents)
    assert.equal(result.length, sampleAscents.length)
    assert.deepEqual(result, sampleAscents)
  })

  it('should filter ascents by grade using case insensitive matching', () => {
    const result = filterAscents(sampleAscents, { grade: '7a' })
    assert.equal(result.length, 38)

    for (const { topoGrade } of result) {
      assert.equal(topoGrade, '7a')
    }
  })

  it('should filter ascents by climbingDiscipline', () => {
    const result = filterAscents(sampleAscents, { climbingDiscipline: 'Route' })
    assert.equal(result.length, 84)
    for (const { climbingDiscipline } of result) {
      assert.equal(climbingDiscipline, 'Route')
    }
  })

  it('should filter ascents by year', () => {
    const result = filterAscents(sampleAscents, { year: 2022 })
    assert.equal(result.length, 13)
    for (const { date } of result) {
      assert.equal(new Date(date).getFullYear(), 2022)
    }
  })

  it('should filter ascents using multiple criteria', () => {
    const result = filterAscents(sampleAscents, {
      climbingDiscipline: 'Route',
      style: 'Redpoint',
    })
    assert.equal(result.length, 27)
    for (const { climbingDiscipline, style } of result) {
      assert.equal(climbingDiscipline, 'Route')
      assert.equal(style, 'Redpoint')
    }
  })

  it('should return an empty array when no ascents are passed', () => {
    const result = filterAscents([])
    assert.equal(result.length, 0)
  })
})

describe('getHardestAscent', () => {
  it('should return the ascent with the highest grade', () => {
    const hardest = getHardestAscent(sampleAscents)
    assert.equal(hardest.topoGrade, '8b+')
  })
})

describe('getMostFrequentCrag', () => {
  it('should return the most frequent crag and the correct number of distinct crags', () => {
    const result = getCragsDetails(sampleAscents)
    assert.equal(result.mostFrequentCrag, 'Fontainebleau')
    assert.equal(result.numberOfCrags, 43)
  })

  it('should handle an empty array and return undefined mostFrequentCrag', () => {
    const result = getCragsDetails([])
    assert.equal(result.numberOfCrags, 0)
    assert.equal(result.mostFrequentCrag, undefined)
  })
})
