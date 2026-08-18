import { z } from 'zod'

const CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u

export const calendarDateSchema = z
  .string()
  .trim()
  .regex(CALENDAR_DATE_PATTERN, 'Expected a calendar date in YYYY-MM-DD format')
  .refine(value => {
    const date = new Date(`${value}T00:00:00.000Z`)
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  }, 'Expected a valid calendar date')

export const nonEmptyStringSchema = z.string().trim().min(1)
export const nonNegativeIntegerSchema = z.number().int().min(0)
export const positiveIntegerSchema = z.number().int().min(1)
export const percentSchema = z.number().int().min(0).max(100)

export const convexSystemFields = {
  _creationTime: z.number().min(0),
  _id: nonEmptyStringSchema,
} as const

export const serverControlledFields = {
  contentFingerprint: nonEmptyStringSchema,
  importJobId: nonEmptyStringSchema.optional(),
  ownerId: nonEmptyStringSchema,
} as const

export function omitServerControlledFields<T extends Record<string, unknown>>(
  record: T,
): Omit<T, keyof typeof serverControlledFields> {
  return Object.fromEntries(
    Object.entries(record).filter(([field]) => !(field in serverControlledFields)),
  ) as Omit<T, keyof typeof serverControlledFields>
}

export const optionalNonEmptyStringSchema = nonEmptyStringSchema.optional()

export const optionalTextCodec = z.codec(z.string().optional(), optionalNonEmptyStringSchema, {
  decode: value => (value === undefined || value.trim() === '' ? undefined : value),
  encode: value => value ?? '',
})

const integerStringSchema = z.string().trim().regex(/^\d+$/u, 'Expected a non-negative integer')

const positiveIntegerStringSchema = z
  .string()
  .trim()
  .regex(/^[1-9]\d*$/u, 'Expected a positive integer')

export const integerCellCodec = z.codec(integerStringSchema, nonNegativeIntegerSchema, {
  decode: Number,
  encode: String,
})

export const positiveIntegerCellCodec = z.codec(
  positiveIntegerStringSchema,
  positiveIntegerSchema,
  {
    decode: Number,
    encode: String,
  },
)

export const percentCellCodec = z.codec(integerStringSchema, percentSchema, {
  decode: Number,
  encode: String,
})

export function createOptionalIntegerCellCodec(outputSchema = nonNegativeIntegerSchema) {
  return z.codec(
    z.union([z.literal(''), integerStringSchema]).optional(),
    outputSchema.optional(),
    {
      decode: value => (value === undefined || value === '' ? undefined : Number(value)),
      encode: value => (value === undefined ? '' : String(value)),
    },
  )
}

export const optionalIntegerCellCodec = createOptionalIntegerCellCodec()
export const optionalPercentCellCodec = createOptionalIntegerCellCodec(percentSchema)

export function optionalEnumCodec<const T extends readonly string[]>(values: T) {
  const enumSchema = z.enum(values)
  return z.codec(z.union([z.literal(''), enumSchema]).optional(), enumSchema.optional(), {
    decode: value => (value === undefined || value === '' ? undefined : value),
    encode: value => value ?? '',
  })
}
