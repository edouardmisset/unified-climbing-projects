import { ascentSchema, type LegacyAscent } from '~/schema/ascent'
import { type LegacyTrainingSession, trainingSessionSchema } from '~/schema/training'
import {
  SYNTHETIC_ASCENT_FIXTURES,
  SYNTHETIC_TRAINING_SESSION_FIXTURES,
} from './synthetic-acceptance-fixture'

const ascents = SYNTHETIC_ASCENT_FIXTURES satisfies readonly Omit<LegacyAscent, 'climber'>[]
const trainingSessions =
  SYNTHETIC_TRAINING_SESSION_FIXTURES satisfies readonly LegacyTrainingSession[]

export const syntheticAscents = ascentSchema.array().parse(ascents)
export const syntheticTrainingSessions = trainingSessionSchema.array().parse(trainingSessions)
