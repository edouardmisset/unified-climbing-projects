import { describe, expect, it } from 'vitest'
import {
  ASCENT_CSV_COLUMNS,
  type AscentPublicInput,
  ascentCsvRowCodec,
  ascentFormSchema,
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
    const result = ascentFormSchema.decode({
      ...ascent,
      area: '   ',
      height: '',
      rating: '5',
      style: 'Redpoint',
      tries: '2',
    })

    expect(result.area).toBeUndefined()
    expect(result.height).toBeUndefined()
    expect(result.rating).toBe(5)
    expect(result.tries).toBe(2)
  })

  it('encodes a canonical ascent back into form values', () => {
    const formValues = ascentFormSchema.encode(ascent)

    expect(formValues).toMatchObject({ height: '25', rating: '4', tries: '1' })
    expect(ascentFormSchema.decode(formValues)).toStrictEqual(ascent)
  })

  it('normalizes an import row to canonical domain values', () => {
    const result = ascentCsvRowCodec.decode({
      ...ascent,
      area: '',
      height: '25',
      rating: '4',
      style: 'Redpoint',
      tries: '3',
    })

    expect(result.area).toBeUndefined()
    expect(result.height).toBe(25)
    expect(result.rating).toBe(4)
    expect(result.tries).toBe(3)
  })

  it('encodes every domain field as a CSV cell in fixed order', () => {
    const result = ascentCsvRowCodec.encode(ascent)

    expect(Object.keys(result)).toStrictEqual(ASCENT_CSV_COLUMNS)
    expect(result).toMatchObject({ height: '25', rating: '4', tries: '1' })
  })

  it('requires Redpoint style for ascents with more than 1 try', () => {
    const ascentFormValues = ascentFormSchema.encode(ascent)
    const ascentCsvRow = ascentCsvRowCodec.encode(ascent)

    expect(ascentPublicInputSchema.safeParse({ ...ascent, tries: 2 }).success).toBe(false)
    expect(ascentFormSchema.safeDecode({ ...ascentFormValues, tries: '2' }).success).toBe(false)
    expect(ascentCsvRowCodec.safeDecode({ ...ascentCsvRow, tries: '2' }).success).toBe(false)
    expect(ascentCsvRowCodec.safeEncode({ ...ascent, tries: 2 }).success).toBe(false)
  })
})
