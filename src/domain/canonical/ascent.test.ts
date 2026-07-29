import { describe, expect, it } from 'vitest'
import {
  ASCENT_CSV_COLUMNS,
  type AscentPublicInput,
  ascentExportRowSchema,
  ascentFormSchema,
  ascentImportRowSchema,
  ascentPublicInputSchema,
  ascentPublicOutputSchema,
  ascentStoredDocumentSchema,
  ascentStoredFieldsSchema,
} from './ascent'
import { omitServerControlledFields } from './common'

const ascent = {
  area: 'North Sector',
  comments: 'Technical and sustained',
  crag: 'Example Crag',
  date: '2024-02-29',
  discipline: 'Sport',
  grade: '7a',
  height: 25,
  holds: 'Crimp',
  name: 'Example Route',
  personalGrade: '7a+',
  profile: 'Vertical',
  rating: 4,
  style: 'Onsight',
  tries: 1,
} as const satisfies AscentPublicInput

describe('ascent storage boundaries', () => {
  it('keeps server-controlled fields in stored records', () => {
    const result = ascentStoredFieldsSchema.parse({
      ...ascent,
      contentFingerprint: 'fingerprint',
      importJobId: 'import-job',
      ownerId: 'owner',
    })

    expect(result.ownerId).toBe('owner')
    expect(result.contentFingerprint).toBe('fingerprint')
    expect(result.importJobId).toBe('import-job')
  })

  it('keeps Convex system fields in stored documents', () => {
    const result = ascentStoredDocumentSchema.parse({
      ...ascent,
      _creationTime: 1,
      _id: 'ascent-id',
      contentFingerprint: 'fingerprint',
      ownerId: 'owner',
    })

    expect(result._id).toBe('ascent-id')
    expect(Object.entries(result)).toContainEqual(['_creationTime', 1])
  })

  it('rejects Convex system fields from table fields', () => {
    expect(
      ascentStoredFieldsSchema.safeParse({
        ...ascent,
        _creationTime: 1,
        _id: 'ascent-id',
        contentFingerprint: 'fingerprint',
        ownerId: 'owner',
      }).success,
    ).toBe(false)
  })
})

describe('ascent public boundaries', () => {
  it('accepts canonical public input', () => {
    expect(ascentPublicInputSchema.parse(ascent)).toStrictEqual(ascent)
  })

  it.each(['ownerId', 'contentFingerprint', 'importJobId', '_id', '_creationTime'])(
    'rejects the server-controlled field %s from public input',
    field => {
      expect(ascentPublicInputSchema.safeParse({ ...ascent, [field]: 'forbidden' }).success).toBe(
        false,
      )
    },
  )

  it('returns Convex system fields without exposing internal metadata', () => {
    const output = ascentPublicOutputSchema.parse({
      ...ascent,
      _creationTime: 1,
      _id: 'ascent-id',
    })

    expect(output._id).toBe('ascent-id')
    expect(ascentPublicOutputSchema.safeParse({ ...output, ownerId: 'owner' }).success).toBe(false)
  })

  it('projects a stored document to strict public output', () => {
    const output = {
      ...ascent,
      _creationTime: 1,
      _id: 'ascent-id',
    }
    const stored = ascentStoredDocumentSchema.parse({
      ...output,
      contentFingerprint: 'fingerprint',
      importJobId: 'job',
      ownerId: 'owner',
    })

    expect(ascentPublicOutputSchema.parse(omitServerControlledFields(stored))).toStrictEqual(output)
  })

  it('rejects legacy fields', () => {
    expect(
      ascentPublicInputSchema.safeParse({
        ...ascent,
        climbingDiscipline: 'Route',
        routeName: 'Legacy Route',
        topoGrade: '7a',
      }).success,
    ).toBe(false)
  })
})

describe('ascent form and CSV boundaries', () => {
  it('normalizes form numbers and empty optional values', () => {
    const result = ascentFormSchema.parse({
      ...ascent,
      area: '   ',
      height: '',
      rating: '5',
      tries: '2',
    })

    expect(result.area).toBeUndefined()
    expect(result.height).toBeUndefined()
    expect(result.rating).toBe(5)
    expect(result.tries).toBe(2)
  })

  it('normalizes an import row to canonical domain values', () => {
    const result = ascentImportRowSchema.parse({
      ...ascent,
      area: '',
      height: '25',
      rating: '4',
      tries: '3',
    })

    expect(result.area).toBeUndefined()
    expect(result.height).toBe(25)
    expect(result.rating).toBe(4)
    expect(result.tries).toBe(3)
  })

  it('requires export rows to contain every CSV column in fixed order', () => {
    const result = ascentExportRowSchema.parse({
      discipline: 'Sport',
      name: 'Example Route',
      grade: '7a',
      crag: 'Example Crag',
      date: '2024-02-29',
      style: 'Onsight',
      tries: '1',
      area: '',
      comments: '',
      height: '',
      holds: '',
      personalGrade: '',
      profile: '',
      rating: '',
    })

    expect(Object.keys(result)).toStrictEqual(ASCENT_CSV_COLUMNS)
  })
})
