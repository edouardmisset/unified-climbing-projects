import { z } from '~/helpers/zod'

const CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export const calendarDateSchema = z
  .string()
  .trim()
  .regex(CALENDAR_DATE_PATTERN, 'Expected a calendar date in YYYY-MM-DD format')
  .refine((value) => {
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
  const publicRecord: Record<string, unknown> = { ...record }
  for (const field of Object.keys(serverControlledFields)) delete publicRecord[field]
  return publicRecord as Omit<T, keyof typeof serverControlledFields>
}

export function emptyStringToUndefined(value: unknown): unknown {
  return typeof value === 'string' && value.trim() === '' ? undefined : value
}

export const optionalNonEmptyStringSchema = nonEmptyStringSchema.optional()

export const optionalFormStringSchema = z.preprocess(
  emptyStringToUndefined,
  optionalNonEmptyStringSchema,
)

export const integerCellSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, 'Expected a non-negative integer')
  .transform(Number)
  .pipe(nonNegativeIntegerSchema)

export const positiveIntegerCellSchema = z
  .string()
  .trim()
  .regex(/^[1-9]\d*$/, 'Expected a positive integer')
  .transform(Number)
  .pipe(positiveIntegerSchema)

export const percentCellSchema = integerCellSchema.pipe(percentSchema)

export const optionalIntegerCellSchema = z.preprocess(
  emptyStringToUndefined,
  integerCellSchema.optional(),
)

export const optionalPercentCellSchema = z.preprocess(
  emptyStringToUndefined,
  percentCellSchema.optional(),
)

export const emptyOrNonEmptyStringSchema = z.union([z.literal(''), nonEmptyStringSchema])
export const emptyOrIntegerCellSchema = z.union([z.literal(''), z.string().regex(/^\d+$/)])
export const emptyOrPercentCellSchema = z.union([
  z.literal(''),
  z
    .string()
    .regex(/^\d+$/)
    .refine((value) => Number(value) <= 100, 'Expected a percentage from 0 to 100'),
])
