import { describe, expect, it } from 'vitest'
import type { AscentDomain } from './ascent'
import {
  toCanonicalAnatomicalRegion,
  toCanonicalDiscipline,
  toCanonicalEnergySystem,
  toLegacyDiscipline,
  transformLegacyAscent,
  transformLegacyTrainingSession,
} from './legacy-transformers'
import type { TrainingSessionDomain } from './training-session'

const legacyAscent = {
  _id: 'legacy-ascent',
  area: 'North Sector',
  climber: 'Synthetic Climber',
  climbingDiscipline: 'Route',
  comments: 'Technical',
  crag: 'Example Crag',
  date: '2024-03-31T22:30:00.000Z',
  height: 25,
  holds: 'Crimp',
  personalGrade: '7a+',
  points: 700,
  profile: 'Vertical',
  rating: 4,
  region: 'Example Region',
  routeName: 'Example Route',
  style: 'Onsight',
  topoGrade: '7a',
  tries: 1,
} as const

const legacyTrainingSession = {
  _id: 'legacy-training',
  anatomicalRegion: 'Fi',
  climbingDiscipline: 'Boulder',
  comments: 'High quality',
  date: '2024-03-31T22:30:00.000Z',
  energySystem: 'AA',
  gymCrag: 'Example Gym',
  intensity: 80,
  load: 48,
  sessionType: 'FB',
  volume: 60,
} as const

describe('legacy form compatibility adapters', () => {
  it.each([
    ['Route', 'Sport'],
    ['Boulder', 'Bouldering'],
    ['Multi-Pitch', 'Multi-Pitch'],
  ] as const)('round-trips the %s discipline', (legacy, canonical) => {
    expect(toCanonicalDiscipline(legacy)).toBe(canonical)
    expect(toLegacyDiscipline(canonical)).toBe(legacy)
  })

  it('expands legacy training form codes for canonical presentation helpers', () => {
    expect(toCanonicalAnatomicalRegion('Ar')).toBe('Arms')
    expect(toCanonicalEnergySystem('AE')).toBe('Aerobic')
  })
})

describe('transformLegacyAscent', () => {
  it.each([
    ['Route', 'Sport'],
    ['Boulder', 'Bouldering'],
    ['Multi-Pitch', 'Multi-Pitch'],
  ] as const)('maps the %s discipline to %s', (legacyDiscipline, canonicalDiscipline) => {
    const result = transformLegacyAscent({
      ...legacyAscent,
      climbingDiscipline: legacyDiscipline,
    })

    expect(result.value.discipline).toBe(canonicalDiscipline)
  })

  it('renames fields, converts the date, and removes legacy-only values', () => {
    const result = transformLegacyAscent(legacyAscent)

    expect(result).toMatchObject({
      id: 'legacy-ascent',
      value: {
        date: '2024-04-01',
        grade: '7a',
        name: 'Example Route',
      },
      wasCanonical: false,
    })
    expect(Object.hasOwn(result.value, 'climber')).toBe(false)
    expect(Object.hasOwn(result.value, 'points')).toBe(false)
    expect(Object.hasOwn(result.value, 'region')).toBe(false)
  })

  it('converts only exact DWS comments', () => {
    const comments = ['DWS', 'DWS', 'DWS', 'DWS ', 'dws', 'Deep Water Soloing']
    const results = comments.map((comment, index) =>
      transformLegacyAscent({ ...legacyAscent, _id: `ascent-${index}`, comments: comment }),
    )

    const conversions = results.filter(
      ({ value }, index) => comments[index] === 'DWS' && value.comments === 'Deep Water Soloing',
    )

    expect(conversions).toHaveLength(3)
    expect(results.at(3)?.value.comments).toBe('DWS')
    expect(results.at(4)?.value.comments).toBe('dws')
    expect(results.at(5)?.value.comments).toBe('Deep Water Soloing')
  })

  it('removes empty optional text values', () => {
    const result = transformLegacyAscent({
      ...legacyAscent,
      area: '   ',
      comments: '',
    })

    expect(Object.hasOwn(result.value, 'area')).toBe(false)
    expect(Object.hasOwn(result.value, 'comments')).toBe(false)
  })

  it('is idempotent for a canonical stored document', () => {
    const canonicalValue = {
      crag: 'Example Crag',
      date: '2024-04-01',
      discipline: 'Sport',
      grade: '7a',
      name: 'Example Route',
      style: 'Onsight',
      tries: 1,
    } as const satisfies AscentDomain

    const result = transformLegacyAscent({
      ...canonicalValue,
      _creationTime: 1,
      _id: 'canonical-ascent',
      contentFingerprint: 'fingerprint',
      ownerId: 'owner',
    })

    expect(result).toStrictEqual({
      id: 'canonical-ascent',
      value: canonicalValue,
      wasCanonical: true,
    })
  })
})

describe('transformLegacyTrainingSession', () => {
  it.each([
    ['Out', 'Outdoor'],
    ['CS', 'Contact Strength'],
    ['Po', 'Power'],
    ['MS', 'Max Strength'],
    ['En', 'Endurance'],
    ['PE', 'Power Endurance'],
    ['SE', 'Strength Endurance'],
    ['Ro', 'Routine'],
    ['FB', 'Finger Board'],
    ['Co', 'Core'],
    ['Sg', 'Stretching'],
    ['Sk', 'Skill'],
    ['St', 'Stamina'],
    ['Ta', 'Chill'],
  ] as const)('maps the %s session type to %s', (legacyType, canonicalType) => {
    const result = transformLegacyTrainingSession({
      ...legacyTrainingSession,
      sessionType: legacyType,
    })

    expect(result.value.type).toBe(canonicalType)
  })

  it('expands codes, renames fields, and removes stored load', () => {
    const result = transformLegacyTrainingSession(legacyTrainingSession)

    expect(result).toMatchObject({
      id: 'legacy-training',
      value: {
        anatomicalRegion: 'Fingers',
        date: '2024-04-01',
        discipline: 'Bouldering',
        energySystem: 'Anaerobic Alactic',
        location: 'Example Gym',
        type: 'Finger Board',
      },
      wasCanonical: false,
    })
    expect(Object.hasOwn(result.value, 'load')).toBe(false)
  })

  it('does not invent intensity from legacy load and volume', () => {
    const { intensity: _intensity, ...withoutIntensity } = legacyTrainingSession
    const result = transformLegacyTrainingSession(withoutIntensity)

    expect(result.value.volume).toBe(60)
    expect(result.value.intensity).toBeUndefined()
    expect(Object.hasOwn(result.value, 'load')).toBe(false)
  })

  it('rejects a legacy session without a type', () => {
    const { sessionType: _sessionType, ...withoutType } = legacyTrainingSession

    expect(() => transformLegacyTrainingSession(withoutType)).toThrow(/Required/u)
  })

  it('is idempotent for a canonical stored document', () => {
    const canonicalValue = {
      date: '2024-04-01',
      discipline: 'Bouldering',
      location: 'Example Gym',
      type: 'Finger Board',
    } as const satisfies TrainingSessionDomain

    const result = transformLegacyTrainingSession({
      ...canonicalValue,
      _creationTime: 1,
      _id: 'canonical-training',
      contentFingerprint: 'fingerprint',
      ownerId: 'owner',
    })

    expect(result).toStrictEqual({
      id: 'canonical-training',
      value: canonicalValue,
      wasCanonical: true,
    })
  })
})
