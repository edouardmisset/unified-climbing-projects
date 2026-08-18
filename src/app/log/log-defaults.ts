import type { AscentListRecord } from '~/domain/ascent'
import type {
  TrainingSessionListRecord,
  TrainingSessionPublicInput,
} from '~/domain/training-session'

type TrainingSessionType = TrainingSessionPublicInput['type']

export type PreviousSessionType = {
  location: string
  type: TrainingSessionType
}

export type LogWizardBootstrap = {
  areas: string[]
  crags: string[]
  defaultGrade?: AscentListRecord['grade']
  latestAscent?: AscentListRecord
  locations: string[]
  previousSessionTypes: PreviousSessionType[]
}

const DEFAULT_ENERGY_SYSTEM_BY_DISCIPLINE = {
  Bouldering: 'Anaerobic Alactic',
  'Multi-Pitch': 'Aerobic',
  Sport: 'Anaerobic Lactic',
} as const satisfies Record<
  AscentListRecord['discipline'],
  NonNullable<TrainingSessionPublicInput['energySystem']>
>

export function normalizeLocationKey(location: string): string {
  return location.trim().toLowerCase()
}

export function inferEnergySystem(
  discipline: AscentListRecord['discipline'],
): NonNullable<TrainingSessionPublicInput['energySystem']> {
  return DEFAULT_ENERGY_SYSTEM_BY_DISCIPLINE[discipline]
}

export function inferSessionType(
  location: string,
  crags: readonly string[],
  previousSessionTypes: readonly PreviousSessionType[],
): TrainingSessionType | undefined {
  const locationKey = normalizeLocationKey(location)
  if (crags.some(crag => normalizeLocationKey(crag) === locationKey)) return 'Outdoor'
  return previousSessionTypes.find(
    previous => normalizeLocationKey(previous.location) === locationKey,
  )?.type
}

export function findMostFrequentGrade(
  ascentsByRecency: readonly AscentListRecord[],
): AscentListRecord['grade'] | undefined {
  const gradeCountByGrade = new Map<AscentListRecord['grade'], number>()
  for (const { grade } of ascentsByRecency)
    gradeCountByGrade.set(grade, (gradeCountByGrade.get(grade) ?? 0) + 1)

  const highestGradeCount = Math.max(...gradeCountByGrade.values(), 0)
  return ascentsByRecency.find(({ grade }) => gradeCountByGrade.get(grade) === highestGradeCount)
    ?.grade
}

export function buildLogWizardBootstrap(
  ascentsByRecency: readonly AscentListRecord[],
  trainingSessions: readonly TrainingSessionListRecord[],
): LogWizardBootstrap {
  const crags = [...new Set(ascentsByRecency.map(({ crag }) => crag.trim()).filter(Boolean))]
  const areas = [...new Set(ascentsByRecency.map(({ area }) => area?.trim()).filter(Boolean))]
  const trainingLocations = trainingSessions
    .map(({ location }) => location?.trim())
    .filter((location): location is string => Boolean(location))
  const locations = [...new Set([...crags, ...trainingLocations])]
  const previousSessionTypeByLocation = new Map<string, TrainingSessionType>()

  for (const trainingSession of trainingSessions.toSorted((a, b) => b.date.localeCompare(a.date))) {
    const location = trainingSession.location?.trim()
    if (location === undefined || location === '') continue
    const locationKey = normalizeLocationKey(location)
    if (!previousSessionTypeByLocation.has(locationKey))
      previousSessionTypeByLocation.set(locationKey, trainingSession.type)
  }

  return {
    areas,
    crags,
    defaultGrade: findMostFrequentGrade(ascentsByRecency),
    latestAscent: ascentsByRecency.at(0),
    locations,
    previousSessionTypes: [...previousSessionTypeByLocation].map(([location, type]) => ({
      location,
      type,
    })),
  }
}
