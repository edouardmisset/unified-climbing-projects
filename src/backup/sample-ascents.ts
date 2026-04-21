import { ascentSchema } from '~/ascents/schema'
import ascents from './ascent-data-sample-2024-10-30.json' with { type: 'json' }

export const sampleAscents = ascentSchema.array().parse(ascents)
