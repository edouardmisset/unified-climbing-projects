import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { api } from '~/../convex/_generated/api'
import { EMPTY_OBJECT } from '~/constants/generic'
import {
  type AscentPublicInput,
  type AscentRecord,
  ascentPublicInputSchema,
  ascentPublicOutputSchema,
} from '~/domain/canonical/ascent'
import {
  transformLegacyAscent,
  transformLegacyTrainingSession,
} from '~/domain/canonical/legacy-transformers'
import {
  type TrainingSessionPublicInput,
  type TrainingSessionRecord,
  trainingSessionPublicInputSchema,
  trainingSessionPublicOutputSchema,
} from '~/domain/canonical/training-session'
import type { LegacyAscent } from '~/schema/ascent'
import type { LegacyTrainingSession } from '~/schema/training'

const compareDates = (a: { date: string }, b: { date: string }): number =>
  new Date(b.date).getTime() - new Date(a.date).getTime()

export async function getConvexAuthToken(): Promise<string> {
  const { auth } = await import('@clerk/nextjs/server')
  const { getToken, isAuthenticated, sessionClaims } = await auth()
  if (!isAuthenticated) throw new Error('Unauthenticated')

  const token =
    sessionClaims.aud === 'convex' ? await getToken() : await getToken({ template: 'convex' })
  if (!token) throw new Error('Unable to create a Convex authentication token')
  return token
}

function normalizeAscentInput(
  input: AscentPublicInput | Omit<LegacyAscent, '_id'>,
): AscentPublicInput {
  const canonical = ascentPublicInputSchema.safeParse(input)
  return canonical.success
    ? canonical.data
    : transformLegacyAscent({ ...input, _id: 'pending-ascent' }).value
}

function normalizeTrainingInput(
  input: TrainingSessionPublicInput | Omit<LegacyTrainingSession, '_id'>,
): TrainingSessionPublicInput {
  const canonical = trainingSessionPublicInputSchema.safeParse(input)
  return canonical.success
    ? canonical.data
    : transformLegacyTrainingSession({ ...input, _id: 'pending-training-session' }).value
}

export async function getAllAscents(): Promise<AscentRecord[]> {
  const token = await getConvexAuthToken()
  const records = await fetchQuery(api.ascents.get, EMPTY_OBJECT, { token })
  return ascentPublicOutputSchema.array().parse(records).toSorted(compareDates)
}

export async function getAscentById(_id: string): Promise<AscentRecord | undefined> {
  const token = await getConvexAuthToken()
  const record = await fetchQuery(api.ascents.getById, { id: _id }, { token })
  return record ? ascentPublicOutputSchema.parse(record) : undefined
}

export async function addAscent(
  ascent: AscentPublicInput | Omit<LegacyAscent, '_id'>,
): Promise<void> {
  const token = await getConvexAuthToken()
  await fetchMutation(api.ascents.post, normalizeAscentInput(ascent), { token })
}

export async function getAllTrainingSessions(): Promise<TrainingSessionRecord[]> {
  const token = await getConvexAuthToken()
  const records = await fetchQuery(api.training.get, EMPTY_OBJECT, { token })
  return trainingSessionPublicOutputSchema.array().parse(records).toSorted(compareDates)
}

export async function addTrainingSession(
  session: TrainingSessionPublicInput | Omit<LegacyTrainingSession, '_id'>,
): Promise<void> {
  const token = await getConvexAuthToken()
  await fetchMutation(api.training.post, normalizeTrainingInput(session), { token })
}

export type ClimbingLogInput = {
  ascents: AscentPublicInput[]
  training?: TrainingSessionPublicInput
}

export async function addClimbingLog(input: ClimbingLogInput): Promise<void> {
  const token = await getConvexAuthToken()
  const args =
    input.training === undefined
      ? { ascents: input.ascents }
      : { ascents: input.ascents, training: input.training }
  await fetchMutation(api.log.post, args, { token })
}
