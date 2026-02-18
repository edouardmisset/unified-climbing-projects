import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { filterAscents, getHardestAscent } from './filter-ascents'

describe('filterAscents', () => {
  it('should return all ascents when no filters are provided', () => {
    const result = filterAscents(sampleAscents)
    expect(result.length).toBe(sampleAscents.length)
    expect(result).toEqual(sampleAscents)
  })

  it('should filter ascents by grade using case insensitive matching', () => {
    const result = filterAscents(sampleAscents, { grade: '7a' })
    expect(result.length).toBe(38)

    for (const { topoGrade } of result) {
      expect(topoGrade).toBe('7a')
    }
  })

  it('should filter ascents by climbingDiscipline', () => {
    const result = filterAscents(sampleAscents, { climbingDiscipline: 'Route' })
    expect(result.length).toBe(84)
    for (const { climbingDiscipline } of result) {
      expect(climbingDiscipline).toBe('Route')
    }
  })

  it('should filter ascents by year', () => {
    const result = filterAscents(sampleAscents, { year: 2022 })
    expect(result.length).toBe(13)
    for (const { date } of result) {
      expect(new Date(date).getFullYear()).toBe(2022)
    }
  })

  it('should filter ascents using multiple criteria', () => {
    const result = filterAscents(sampleAscents, {
      climbingDiscipline: 'Route',
      style: 'Redpoint',
    })
    expect(result.length).toBe(27)
    for (const { climbingDiscipline, style } of result) {
      expect(climbingDiscipline).toBe('Route')
      expect(style).toBe('Redpoint')
    }
  })

  it('should return an empty array when no ascents are passed', () => {
    const result = filterAscents([])
    expect(result.length).toBe(0)
  })
})

describe('getHardestAscent', () => {
  it('should return the ascent with the highest grade', () => {
    const hardest = getHardestAscent(sampleAscents)
    expect(hardest).toBeDefined()
    expect(hardest?.topoGrade).toBe('8b+')
  })
})
