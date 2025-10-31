import { ascentSchema } from '~/schema/ascent'
import ascents from './ascent-data-sample-2025-10-31-migrated.json' with {
  type: 'json',
}

export const sampleAscents = ascentSchema.array().parse(ascents)
