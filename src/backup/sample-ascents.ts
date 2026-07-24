import { toCanonicalAscentRecord } from '~/domain/canonical/legacy-transformers'
import { ascentSchema } from '~/schema/ascent'
import ascents from './ascent-data-sample-2024-10-30.json' with { type: 'json' }

export const sampleAscents = ascentSchema.array().parse(ascents).map(toCanonicalAscentRecord)
