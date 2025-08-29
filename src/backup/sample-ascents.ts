import { ascentSchema } from '~/schema/ascent'
import ascents from './ascent-data-sample-2024-10-30.json' with { type: 'json' }

// Normalize legacy sample data (id: number) to current schema (_id: string)
const normalized = (ascents as unknown as Array<Record<string, unknown>>).map(
  (a, i) => {
    const legacyId = a.id as number | undefined
    return {
      ...a,
      _id: String(legacyId ?? i + 1),
      // Do not keep legacy id in typed output
      id: undefined,
    }
  },
)

export const sampleAscents = ascentSchema.array().parse(normalized)
