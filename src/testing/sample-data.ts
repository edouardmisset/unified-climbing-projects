import { ascentImportRowSchema } from '~/domain/ascent'
import { trainingSessionImportRowSchema } from '~/domain/training-session'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import ascentsData from '../../tests/fixtures/ascents.json'
import trainingSessionsData from '../../tests/fixtures/training-sessions.json'

/**
 * Real (anonymized-by-nature) climbing data recorded by the app's author,
 * shared in https://github.com/edouardmisset/unified-climbing-projects/issues/127
 * so that component tests exercise realistic shapes and distributions instead
 * of hand-crafted fixtures.
 */
export const sampleAscents: Ascent[] = ascentsData.map((row, index) =>
  Object.assign(ascentImportRowSchema.parse(row), { _id: `sample-ascent-${index}` }),
)

export const sampleTrainingSessions: TrainingSession[] = trainingSessionsData.map((row, index) =>
  Object.assign(trainingSessionImportRowSchema.parse(row), { _id: `sample-training-${index}` }),
)
