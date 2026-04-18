import { describe, expect, it } from 'vitest'
import { sampleAscents } from '~/backup/sample-ascents'
import { ascentIdSchema, type Ascent } from '~/schema/ascent'
import { isoDateSchema } from '~/schema/generic'
import { getTopTenEvolution } from './get-top-ten-evolution'

function countDisciplineForYear(
  ascents: Ascent[],
  discipline: Ascent['climbingDiscipline'],
  year: number,
): number {
  return ascents.filter(
    ascent =>
      ascent.climbingDiscipline === discipline && new Date(ascent.date).getFullYear() === year,
  ).length
}

describe('getTopTenEvolution', () => {
  it('should return empty array for empty input', () => {
    const result = getTopTenEvolution([])
    expect(result).toEqual([])
  })

  it('should return one entry for a single-year dataset', () => {
    const ascentsIn2024 = sampleAscents.filter(({ date }) => new Date(date).getFullYear() === 2_024)

    const result = getTopTenEvolution(ascentsIn2024)

    expect(result).toEqual([
      {
        Boulder: countDisciplineForYear(ascentsIn2024, 'Boulder', 2_024),
        Route: countDisciplineForYear(ascentsIn2024, 'Route', 2_024),
        ascents: ascentsIn2024.length,
        outdoorDays: 17,
        topTenScore: 9_250,
        year: 2_024,
      },
    ])
  })

  it('should return a continuous year range with zeroes for missing years', () => {
    const [firstAscent, secondAscent, thirdAscent] = sampleAscents

    if (!firstAscent || !secondAscent || !thirdAscent)
      throw new Error('Expected at least three sample ascents')

    const ascents: Ascent[] = [
      {
        ...firstAscent,
        _id: ascentIdSchema.parse('top-ten-evolution-1'),
        date: isoDateSchema.parse('2022-01-10'),
      },
      {
        ...secondAscent,
        _id: ascentIdSchema.parse('top-ten-evolution-2'),
        date: isoDateSchema.parse('2024-03-12'),
      },
      {
        ...thirdAscent,
        _id: ascentIdSchema.parse('top-ten-evolution-3'),
        date: isoDateSchema.parse('2024-09-05'),
      },
    ]

    const result = getTopTenEvolution(ascents)

    expect(result).toEqual([
      {
        Boulder: countDisciplineForYear(ascents, 'Boulder', 2_022),
        Route: countDisciplineForYear(ascents, 'Route', 2_022),
        ascents: 1,
        outdoorDays: 1,
        topTenScore: 850,
        year: 2_022,
      },
      {
        Boulder: 0,
        Route: 0,
        ascents: 0,
        outdoorDays: 0,
        topTenScore: 0,
        year: 2_023,
      },
      {
        Boulder: countDisciplineForYear(ascents, 'Boulder', 2_024),
        Route: countDisciplineForYear(ascents, 'Route', 2_024),
        ascents: 2,
        outdoorDays: 2,
        topTenScore: 1_750,
        year: 2_024,
      },
    ])
  })
})
