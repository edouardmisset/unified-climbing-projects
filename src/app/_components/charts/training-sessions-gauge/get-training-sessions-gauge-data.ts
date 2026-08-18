import { TRAINING_SESSION_TYPES } from '~/domain/training-session'
import {
  TRAINING_SESSION_TYPE_TO_BACKGROUND_COLOR,
  TRAINING_SESSION_TYPE_TO_CALENDAR_LABEL,
} from '~/constants/training'
import type { TrainingSession } from '~/schema/training'

type TrainingSessionType = NonNullable<TrainingSession['type']>

type GaugeGroupId = 'Outdoor' | 'Aerobic' | 'Endurance' | 'Max strength' | 'Chill' | 'Others'

type TypeGroup = {
  id: GaugeGroupId
  label: string
  types: readonly TrainingSessionType[]
}

export type TrainingSessionsGaugeDatum = {
  id: string
  label: string
  value: number
  fill: string
}

export type TrainingSessionsGaugeTypeDatum = TrainingSessionsGaugeDatum & {
  groupId: GaugeGroupId
}

const TYPE_GROUPS = [
  {
    id: 'Outdoor',
    label: 'Outdoor',
    types: ['Outdoor'],
  },
  {
    id: 'Aerobic',
    label: 'Aerobic (AE)',
    types: ['Stamina'],
  },
  {
    id: 'Endurance',
    label: 'Endurance (PE, En, SE)',
    types: ['Power Endurance', 'Endurance', 'Strength Endurance'],
  },
  {
    id: 'Max strength',
    label: 'Max strength (CS, MS, Po)',
    types: ['Contact Strength', 'Max Strength', 'Power'],
  },
  {
    id: 'Chill',
    label: 'Chill',
    types: ['Chill'],
  },
] as const satisfies readonly TypeGroup[]

const GROUP_TYPES = new Set(TYPE_GROUPS.flatMap(group => group.types))
const OTHER_TYPES = TRAINING_SESSION_TYPES.filter(type => !GROUP_TYPES.has(type))
const GROUP_FILL_BY_ID: Record<GaugeGroupId, string> = {
  Outdoor: 'var(--outdoor)',
  Aerobic: 'var(--stamina)',
  Endurance: 'var(--endurance)',
  'Max strength': 'var(--strength)',
  Chill: 'var(--tapered)',
  Others: 'var(--otherTraining)',
}

export function getTrainingSessionsGaugeData(sessions: TrainingSession[]): {
  groupData: TrainingSessionsGaugeDatum[]
  typeData: TrainingSessionsGaugeTypeDatum[]
} {
  if (sessions.length === 0) return { groupData: [], typeData: [] }

  const typeCounts = new Map<TrainingSessionType, number>()

  for (const { type } of sessions) typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1)

  const groupedData = [
    ...TYPE_GROUPS.map(group => toGroupedData(group, typeCounts)),
    toGroupedData(
      {
        id: 'Others',
        label: 'Others',
        types: OTHER_TYPES,
      },
      typeCounts,
    ),
  ]
    .filter(group => group.total > 0)
    .toSorted((a, b) => b.total - a.total || a.label.localeCompare(b.label))

  const groupData: TrainingSessionsGaugeDatum[] = groupedData.map(({ fill, id, label, total }) => ({
    fill,
    id,
    label,
    value: total,
  }))

  const typeData: TrainingSessionsGaugeTypeDatum[] = groupedData.flatMap(({ id: groupId, types }) =>
    types.map(type => ({ ...type, groupId })),
  )

  return { groupData, typeData }
}

function toGroupedData(group: TypeGroup, counts: Map<TrainingSessionType, number>) {
  const types = group.types
    .map(type => {
      const count = counts.get(type) ?? 0
      return {
        fill: TRAINING_SESSION_TYPE_TO_BACKGROUND_COLOR[type],
        id: type,
        label: `${TRAINING_SESSION_TYPE_TO_CALENDAR_LABEL[type]} · ${type}`,
        value: count,
      }
    })
    .filter(({ value }) => value > 0)
    .toSorted((a, b) => b.value - a.value || a.label.localeCompare(b.label))

  return {
    id: group.id,
    label: group.label,
    total: types.reduce((sum, { value }) => sum + value, 0),
    types,
    fill: GROUP_FILL_BY_ID[group.id],
  }
}
