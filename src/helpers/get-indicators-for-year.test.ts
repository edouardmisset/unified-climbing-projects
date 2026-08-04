import { describe, expect, it } from 'vite-plus/test'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { getIndicatorsForYear } from './get-indicators-for-year'

function ascent(
  id: string,
  values: { date: string; grade: Ascent['grade']; style: Ascent['style'] },
): Ascent {
  const { date, grade, style } = values
  return {
    _id: id,
    crag: 'Test Crag',
    date,
    discipline: 'Sport',
    grade,
    name: id,
    style,
    tries: style === 'Redpoint' ? 3 : 1,
  }
}

function outdoorSession(id: string, date: string): TrainingSession {
  return { _id: id, date, discipline: 'Sport', type: 'Outdoor' }
}

describe('getIndicatorsForYear', () => {
  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'returns zeroed indicators for invalid year %s',
    year => {
      expect(getIndicatorsForYear({ allAscents: [], allTrainingSessions: [], year })).toStrictEqual(
        {
          efficiency: 0,
          progression: 0,
          score: 0,
          versatility: 0,
          year,
        },
      )
    },
  )

  it('returns zeroed indicators when the selected year has no ascents', () => {
    expect(
      getIndicatorsForYear({
        allAscents: [ascent('old', { date: '2025-01-01', grade: '8a', style: 'Onsight' })],
        allTrainingSessions: [outdoorSession('session', '2026-01-01')],
        year: 2_026,
      }),
    ).toStrictEqual({ efficiency: 0, progression: 0, score: 0, versatility: 0, year: 2_026 })
  })

  it('combines current ascents, previous-year progression, and current outdoor days', () => {
    const result = getIndicatorsForYear({
      allAscents: [
        ascent('previous', { date: '2025-06-01', grade: '6a', style: 'Redpoint' }),
        ascent('onsight', { date: '2026-05-01', grade: '7a', style: 'Onsight' }),
        ascent('redpoint', { date: '2026-05-02', grade: '7b', style: 'Redpoint' }),
        ascent('future', { date: '2027-01-01', grade: '9a', style: 'Onsight' }),
      ],
      allTrainingSessions: [
        outdoorSession('outdoor', '2026-05-01'),
        { _id: 'indoor', date: '2026-05-03', type: 'Endurance' },
      ],
      year: 2_026,
    })

    expect(result.year).toBe(2_026)
    expect(result.progression).toBeGreaterThan(0)
    expect(result.efficiency).toBeGreaterThan(0)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.versatility).toBeGreaterThanOrEqual(0)
  })
})
