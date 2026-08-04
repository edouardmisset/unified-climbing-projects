import { describe, expect, it } from 'vite-plus/test'
import type { TrainingSession } from '~/schema/training'
import {
  calculateSessionPercentage,
  categorizeSessions,
  getSessionRatioData,
  isIndoorSession,
} from './helpers'

function session(
  id: string,
  type: TrainingSession['type'],
  discipline?: TrainingSession['discipline'],
): TrainingSession {
  return { _id: id, date: '2026-08-01', discipline, type }
}

describe('training summary helpers', () => {
  it('formats ratios and handles an empty denominator', () => {
    expect(calculateSessionPercentage(0, 0)).toBe('N/A')
    expect(calculateSessionPercentage(1, 2)).toBe('30 %')
    expect(calculateSessionPercentage(2, 1)).toBe('70 %')
  })

  it('returns counts, labels, sessions, and the computed percentage', () => {
    const indoor = [session('indoor', 'Endurance', 'Sport')]
    const outdoor = [session('outdoor-1', 'Outdoor'), session('outdoor-2', 'Outdoor')]

    expect(
      getSessionRatioData({
        firstLabel: 'Indoor',
        firstSessions: indoor,
        secondLabel: 'Outdoor',
        secondSessions: outdoor,
      }),
    ).toStrictEqual({
      firstCount: 1,
      firstLabel: 'Indoor',
      firstSessions: indoor,
      percentage: '30 %',
      secondCount: 2,
      secondLabel: 'Outdoor',
      secondSessions: outdoor,
    })
  })

  it('categorizes indoor and outdoor route and boulder sessions', () => {
    const indoorRoute = session('indoor-route', 'Endurance', 'Sport')
    const indoorBoulder = session('indoor-boulder', 'Power', 'Bouldering')
    const outdoorRoute = session('outdoor-route', 'Outdoor', 'Sport')
    const outdoorBoulder = session('outdoor-boulder', 'Outdoor', 'Bouldering')
    const uncategorized = session('other', 'Finger Board')

    expect(
      categorizeSessions([indoorRoute, indoorBoulder, outdoorRoute, outdoorBoulder, uncategorized]),
    ).toStrictEqual({
      indoor: [indoorRoute, indoorBoulder],
      indoorBoulder: [indoorBoulder],
      indoorRoute: [indoorRoute],
      outdoor: [outdoorRoute, outdoorBoulder],
      outdoorBoulder: [outdoorBoulder],
      outdoorRoute: [outdoorRoute],
    })
  })

  it('recognizes indoor types without treating missing or outdoor types as indoor', () => {
    expect(isIndoorSession({ type: 'Endurance' })).toBe(true)
    expect(isIndoorSession({ type: 'Outdoor' })).toBe(false)
    expect(isIndoorSession({})).toBe(false)
  })
})
