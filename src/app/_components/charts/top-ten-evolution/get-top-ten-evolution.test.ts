import { describe, expect, it } from 'vite-plus/test'
import { sampleAscents } from '~/backup/sample-ascents'
import type { Ascent } from '~/schema/ascent'
import { getTopTenEvolution } from './get-top-ten-evolution'

function countDisciplineForYear(
  ascents: Ascent[],
  discipline: Ascent['discipline'],
  year: number,
): number {
  return ascents.filter(
    (ascent) => ascent.discipline === discipline && new Date(ascent.date).getFullYear() === year,
  ).length
}

describe('getTopTenEvolution', () => {
  it('should return empty array for empty input', () => {
    const result = getTopTenEvolution([])
    expect(result).toStrictEqual([])
  })

  it('should return one entry for a single-year dataset', () => {
    const ascentsIn2024 = sampleAscents.filter(({ date }) => new Date(date).getFullYear() === 2_024)

    const result = getTopTenEvolution(ascentsIn2024)

    expect(result).toStrictEqual([
      {
        Bouldering: countDisciplineForYear(ascentsIn2024, 'Bouldering', 2_024),
        Sport: countDisciplineForYear(ascentsIn2024, 'Sport', 2_024),
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
        _id: 'top-ten-evolution-1',
        date: '2022-01-10',
      },
      {
        ...secondAscent,
        _id: 'top-ten-evolution-2',
        date: '2024-03-12',
      },
      {
        ...thirdAscent,
        _id: 'top-ten-evolution-3',
        date: '2024-09-05',
      },
    ]

    const result = getTopTenEvolution(ascents)

    expect(result).toStrictEqual([
      {
        Bouldering: countDisciplineForYear(ascents, 'Bouldering', 2_022),
        Sport: countDisciplineForYear(ascents, 'Sport', 2_022),
        ascents: 1,
        outdoorDays: 1,
        topTenScore: 850,
        year: 2_022,
      },
      {
        Bouldering: 0,
        Sport: 0,
        ascents: 0,
        outdoorDays: 0,
        topTenScore: 0,
        year: 2_023,
      },
      {
        Bouldering: countDisciplineForYear(ascents, 'Bouldering', 2_024),
        Sport: countDisciplineForYear(ascents, 'Sport', 2_024),
        ascents: 2,
        outdoorDays: 2,
        topTenScore: 1_750,
        year: 2_024,
      },
    ])
  })
})
