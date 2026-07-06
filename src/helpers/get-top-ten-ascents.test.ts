import { describe, expect, it } from 'vitest'
import type { Ascent, Grade } from '~/schema/ascent'
import { getTopTenAscents } from './get-top-ten-ascents'

const createAscent = (id: number, year: number, topoGrade: Grade): Ascent => ({
  _id: `${year}-${id}`,
  climbingDiscipline: 'Route',
  comments: '',
  crag: 'Buoux',
  date: `${year}-01-${String(id + 1).padStart(2, '0')}`,
  routeName: `Route ${id}`,
  style: 'Redpoint',
  topoGrade,
  tries: 1,
})

describe('getTopTenAscents', () => {
  it('returns the ten highest-scoring ascents for the requested year', () => {
    const ascents = [
      createAscent(0, 2_024, '9a'),
      ...Array.from({ length: 11 }, (_, index) =>
        createAscent(index, 2_025, index === 0 ? '5a' : '7a'),
      ),
    ]

    const result = getTopTenAscents({ ascents, timeframe: 'year', year: 2_025 })

    expect(result).toHaveLength(10)
    expect(result).not.toContainEqual(expect.objectContaining({ _id: '2024-0' }))
    expect(result).not.toContainEqual(expect.objectContaining({ _id: '2025-0' }))
  })
})
