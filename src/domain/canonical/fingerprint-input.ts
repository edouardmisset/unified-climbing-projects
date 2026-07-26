import { ascentDomainSchema } from './ascent'
import { trainingSessionDomainSchema } from './training-session'

function serializeDefinedFields(value: Record<string, unknown>): string {
  return JSON.stringify(
    Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)),
  )
}

export function createAscentFingerprintInput(input: unknown): string {
  const ascent = ascentDomainSchema.parse(input)

  return serializeDefinedFields({
    discipline: ascent.discipline,
    name: ascent.name,
    grade: ascent.grade,
    crag: ascent.crag,
    date: ascent.date,
    style: ascent.style,
    tries: ascent.tries,
    area: ascent.area,
    comments: ascent.comments,
    height: ascent.height,
    holds: ascent.holds,
    personalGrade: ascent.personalGrade,
    profile: ascent.profile,
    rating: ascent.rating,
  })
}

export function createTrainingSessionFingerprintInput(input: unknown): string {
  const trainingSession = trainingSessionDomainSchema.parse(input)

  return serializeDefinedFields({
    date: trainingSession.date,
    type: trainingSession.type,
    discipline: trainingSession.discipline,
    location: trainingSession.location,
    anatomicalRegion: trainingSession.anatomicalRegion,
    energySystem: trainingSession.energySystem,
    comments: trainingSession.comments,
    intensity: trainingSession.intensity,
    volume: trainingSession.volume,
  })
}
