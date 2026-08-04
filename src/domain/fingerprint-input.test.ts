import { describe, expect, it } from 'vitest'
import {
  createAscentFingerprintInput,
  createTrainingSessionFingerprintInput,
} from './fingerprint-input'

describe('createAscentFingerprintInput', () => {
  const ascent = {
    crag: 'Éxample Crag',
    date: '2024-02-29',
    discipline: 'Sport',
    grade: '7a',
    name: 'À vue',
    style: 'Onsight',
    tries: 1,
  } as const

  it('uses deterministic canonical field ordering', () => {
    const reorderedAscent = {
      tries: 1,
      style: 'Onsight',
      name: 'À vue',
      grade: '7a',
      discipline: 'Sport',
      date: '2024-02-29',
      crag: 'Éxample Crag',
    }

    expect(createAscentFingerprintInput(reorderedAscent)).toBe(createAscentFingerprintInput(ascent))
  })

  it('removes absent optional values', () => {
    expect(createAscentFingerprintInput({ ...ascent, area: undefined })).toBe(
      createAscentFingerprintInput(ascent),
    )
  })

  it('preserves case and accents', () => {
    expect(createAscentFingerprintInput({ ...ascent, name: 'À vue' })).not.toBe(
      createAscentFingerprintInput({ ...ascent, name: 'à vue' }),
    )
    expect(createAscentFingerprintInput({ ...ascent, name: 'A vue' })).not.toBe(
      createAscentFingerprintInput(ascent),
    )
  })

  it('rejects IDs and server metadata', () => {
    expect(() => createAscentFingerprintInput({ ...ascent, ownerId: 'owner' })).toThrow(
      /Unrecognized key/u,
    )
    expect(() => createAscentFingerprintInput({ ...ascent, _id: 'ascent-id' })).toThrow(
      /Unrecognized key/u,
    )
  })
})

describe('createTrainingSessionFingerprintInput', () => {
  const trainingSession = {
    comments: 'Échauffement',
    date: '2024-02-29',
    intensity: 80,
    type: 'Endurance',
    volume: 60,
  } as const

  it('uses deterministic canonical field ordering', () => {
    const reorderedTrainingSession = {
      volume: 60,
      type: 'Endurance',
      intensity: 80,
      date: '2024-02-29',
      comments: 'Échauffement',
    }

    expect(createTrainingSessionFingerprintInput(reorderedTrainingSession)).toBe(
      createTrainingSessionFingerprintInput(trainingSession),
    )
  })

  it('does not include derived load', () => {
    expect(() => createTrainingSessionFingerprintInput({ ...trainingSession, load: 48 })).toThrow(
      /Unrecognized key/u,
    )
  })

  it('preserves case and accents', () => {
    expect(
      createTrainingSessionFingerprintInput({ ...trainingSession, comments: 'Échauffement' }),
    ).not.toBe(
      createTrainingSessionFingerprintInput({ ...trainingSession, comments: 'échauffement' }),
    )
  })
})
