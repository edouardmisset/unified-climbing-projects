import { describe, expect, it } from 'vitest'
import {
  TRAINING_SESSION_CSV_COLUMNS,
  type TrainingSessionPublicInput,
  trainingSessionExportRowSchema,
  trainingSessionFormSchema,
  trainingSessionImportRowSchema,
  trainingSessionPublicInputSchema,
  trainingSessionPublicOutputSchema,
  trainingSessionStoredDocumentSchema,
  trainingSessionStoredFieldsSchema,
} from './training-session'
import { omitServerControlledFields } from './common'

const trainingSession = {
  anatomicalRegion: 'Fingers',
  comments: 'High-quality session',
  date: '2024-02-29',
  discipline: 'Bouldering',
  energySystem: 'Anaerobic Alactic',
  intensity: 80,
  location: 'Example Gym',
  type: 'Finger Board',
  volume: 60,
} as const satisfies TrainingSessionPublicInput

describe('training session storage boundaries', () => {
  it('keeps server-controlled fields in stored records', () => {
    const result = trainingSessionStoredFieldsSchema.parse({
      ...trainingSession,
      contentFingerprint: 'fingerprint',
      importJobId: 'import-job',
      ownerId: 'owner',
    })

    expect(result.ownerId).toBe('owner')
    expect(result.contentFingerprint).toBe('fingerprint')
    expect(result.importJobId).toBe('import-job')
  })

  it('keeps Convex system fields in stored documents', () => {
    const result = trainingSessionStoredDocumentSchema.parse({
      ...trainingSession,
      _creationTime: 1,
      _id: 'training-id',
      contentFingerprint: 'fingerprint',
      ownerId: 'owner',
    })

    expect(result._id).toBe('training-id')
    expect(Object.entries(result)).toContainEqual(['_creationTime', 1])
  })

  it('rejects Convex system fields from table fields', () => {
    expect(
      trainingSessionStoredFieldsSchema.safeParse({
        ...trainingSession,
        _creationTime: 1,
        _id: 'training-id',
        contentFingerprint: 'fingerprint',
        ownerId: 'owner',
      }).success,
    ).toBe(false)
  })
})

describe('training session public boundaries', () => {
  it('accepts canonical public input', () => {
    expect(trainingSessionPublicInputSchema.parse(trainingSession)).toStrictEqual(trainingSession)
  })

  it.each(['ownerId', 'contentFingerprint', 'importJobId', '_id', '_creationTime', 'load'])(
    'rejects the internal field %s from public input',
    (field) => {
      expect(
        trainingSessionPublicInputSchema.safeParse({
          ...trainingSession,
          [field]: 'forbidden',
        }).success,
      ).toBe(false)
    },
  )

  it('returns Convex system fields without exposing internal metadata', () => {
    const output = trainingSessionPublicOutputSchema.parse({
      ...trainingSession,
      _creationTime: 1,
      _id: 'training-id',
    })

    expect(output._id).toBe('training-id')
    expect(
      trainingSessionPublicOutputSchema.safeParse({ ...output, ownerId: 'owner' }).success,
    ).toBe(false)
  })

  it('projects a stored document to strict public output', () => {
    const output = {
      ...trainingSession,
      _creationTime: 1,
      _id: 'training-id',
    }
    const stored = trainingSessionStoredDocumentSchema.parse({
      ...output,
      contentFingerprint: 'fingerprint',
      importJobId: 'job',
      ownerId: 'owner',
    })

    expect(
      trainingSessionPublicOutputSchema.parse(omitServerControlledFields(stored)),
    ).toStrictEqual(output)
  })

  it('requires a canonical session type', () => {
    const { type: _type, ...withoutType } = trainingSession

    expect(trainingSessionPublicInputSchema.safeParse(withoutType).success).toBe(false)
    expect(
      trainingSessionPublicInputSchema.safeParse({ ...withoutType, sessionType: 'FB' }).success,
    ).toBe(false)
  })
})

describe('training session form and CSV boundaries', () => {
  it('normalizes form percentages and empty optional values', () => {
    const result = trainingSessionFormSchema.parse({
      ...trainingSession,
      comments: '   ',
      intensity: '90',
      location: '',
      volume: '40',
    })

    expect(result.comments).toBeUndefined()
    expect(result.intensity).toBe(90)
    expect(result.location).toBeUndefined()
    expect(result.volume).toBe(40)
  })

  it('normalizes an import row to canonical domain values', () => {
    const result = trainingSessionImportRowSchema.parse({
      ...trainingSession,
      comments: '',
      intensity: '80',
      location: '',
      volume: '60',
    })

    expect(result.comments).toBeUndefined()
    expect(result.intensity).toBe(80)
    expect(result.location).toBeUndefined()
    expect(result.volume).toBe(60)
  })

  it('requires export rows to contain every CSV column in fixed order', () => {
    const result = trainingSessionExportRowSchema.parse({
      date: '2024-02-29',
      type: 'Finger Board',
      discipline: '',
      location: '',
      anatomicalRegion: '',
      energySystem: '',
      comments: '',
      intensity: '',
      volume: '',
    })

    expect(Object.keys(result)).toStrictEqual(TRAINING_SESSION_CSV_COLUMNS)
  })
})
