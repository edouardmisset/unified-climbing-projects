import { describe, expect, it } from 'vite-plus/test'
import type { AscentListRecord } from '~/domain/ascent'
import type { TrainingSessionListRecord } from '~/domain/training-session'
import {
  buildLogWizardBootstrap,
  findMostFrequentGrade,
  inferEnergySystem,
  inferLogContents,
  inferSessionType,
} from './log-defaults'

const ascent = (grade: AscentListRecord['grade'], date: string): AscentListRecord => ({
  _creationTime: 1,
  _id: `ascent-${date}`,
  crag: 'Céüse',
  date,
  discipline: 'Sport',
  grade,
  name: 'Route',
  style: 'Redpoint',
  tries: 2,
})

const session = (
  location: string,
  type: TrainingSessionListRecord['type'],
  date: string,
): TrainingSessionListRecord => ({
  _creationTime: 1,
  _id: `session-${date}`,
  date,
  location,
  type,
})

describe('log defaults', () => {
  it('maps disciplines to their default energy systems', () => {
    expect(inferEnergySystem('Sport')).toBe('Anaerobic Lactic')
    expect(inferEnergySystem('Multi-Pitch')).toBe('Aerobic')
    expect(inferEnergySystem('Bouldering')).toBe('Anaerobic Alactic')
  })

  it('prefers Outdoor for crags and otherwise uses the previous location type', () => {
    const previous = [{ location: 'arkose', type: 'Power' }] as const
    expect(inferSessionType(' céüse ', ['Céüse'], previous)).toBe('Outdoor')
    expect(inferSessionType('Arkose', ['Céüse'], previous)).toBe('Power')
    expect(inferSessionType('Unknown', ['Céüse'], previous)).toBeUndefined()
  })

  it('infers log contents from known indoor locations and crags', () => {
    expect(inferLogContents('Arkose', ['Arkose'], ['Céüse'])).toStrictEqual({
      hasAscents: false,
      hasTraining: true,
    })
    expect(inferLogContents('Céüse', ['Arkose'], ['Céüse'])).toStrictEqual({
      hasAscents: true,
      hasTraining: false,
    })
    expect(inferLogContents('Unknown', ['Arkose'], ['Céüse'])).toStrictEqual({
      hasAscents: false,
      hasTraining: false,
    })
  })

  it('uses recency to break ties between the most frequent grades', () => {
    expect(
      findMostFrequentGrade([
        ascent('7a', '2026-03-03'),
        ascent('6c', '2026-03-02'),
        ascent('6c', '2026-03-01'),
        ascent('7a', '2026-02-28'),
      ]),
    ).toBe('7a')
  })

  it('builds serializable suggestions and the latest type per location', () => {
    const bootstrap = buildLogWizardBootstrap(
      [ascent('7a', '2026-03-03')],
      [
        session('Arkose', 'Power', '2026-03-01'),
        session('Arkose', 'Endurance', '2026-02-01'),
        session('Fontainebleau', 'Outdoor', '2026-01-01'),
      ],
    )

    expect(bootstrap.defaultGrade).toBe('7a')
    expect(bootstrap.crags).toStrictEqual(['Céüse'])
    expect(bootstrap.indoorLocations).toStrictEqual(['Arkose'])
    expect(bootstrap.latestLocation).toBe('Céüse')
    expect(bootstrap.locations).toStrictEqual(['Céüse', 'Arkose', 'Fontainebleau'])
    expect(bootstrap.outdoorLocations).toStrictEqual(['Céüse', 'Fontainebleau'])
    expect(bootstrap.previousSessionTypes).toStrictEqual([
      { location: 'arkose', type: 'Power' },
      { location: 'fontainebleau', type: 'Outdoor' },
    ])
  })
})
