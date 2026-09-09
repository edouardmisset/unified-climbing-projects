import { ANATOMICAL_REGIONS, ENERGY_SYSTEMS } from '~/domain/training-session'
import type { TrainingSession } from '~/schema/training'

type AnatomicalRegion = NonNullable<TrainingSession['anatomicalRegion']>
type EnergySystem = NonNullable<TrainingSession['energySystem']>

type RadialBarData = {
  id: string
  data: {
    x: string
    y: number
  }[]
}[]

type DistributionKey = AnatomicalRegion | EnergySystem

type DistributionPalette<T extends DistributionKey> = {
  colors: Record<T, string>
  labels: Record<T, string>
}

type SessionsDistributionData = {
  data: RadialBarData
  colors: Record<string, string>
  legendData: { id: string; label: string; color: string }[]
  totals: Record<string, number>
}

const ENERGY_SYSTEM_COLORS = {
  'Anaerobic Alactic': 'var(--energySystemAA)',
  Aerobic: 'var(--energySystemAE)',
  'Anaerobic Lactic': 'var(--energySystemAL)',
} as const

const ENERGY_SYSTEM_LABELS = {
  'Anaerobic Alactic': 'Anaerobic Alactic',
  Aerobic: 'Aerobic',
  'Anaerobic Lactic': 'Anaerobic Lactic',
} as const

const ANATOMICAL_REGION_COLORS = {
  Arms: 'var(--anatomicalRegionAr)',
  Fingers: 'var(--anatomicalRegionFi)',
  General: 'var(--anatomicalRegionGe)',
} as const

const ANATOMICAL_REGION_LABELS = {
  Arms: 'Arms',
  Fingers: 'Fingers',
  General: 'General',
} as const

export function getSessionsDistributionData(sessions: TrainingSession[]): SessionsDistributionData {
  if (sessions.length === 0) return { colors: {}, data: [], legendData: [], totals: {} }

  const energySystemCounts = countDefinedValues(sessions.map(({ energySystem }) => energySystem))
  const regionCounts = countDefinedValues(sessions.map(({ anatomicalRegion }) => anatomicalRegion))

  const colors: Record<string, string> = {}

  // Build Energy System ring data
  const energySystemData = buildRingData(ENERGY_SYSTEMS, energySystemCounts, ENERGY_SYSTEM_LABELS)
  Object.assign(
    colors,
    buildColors(ENERGY_SYSTEMS, energySystemCounts, {
      colors: ENERGY_SYSTEM_COLORS,
      labels: ENERGY_SYSTEM_LABELS,
    }),
  )

  // Build Anatomical Region ring data
  const anatomicalRegionData = buildRingData(
    ANATOMICAL_REGIONS,
    regionCounts,
    ANATOMICAL_REGION_LABELS,
  )
  Object.assign(
    colors,
    buildColors(ANATOMICAL_REGIONS, regionCounts, {
      colors: ANATOMICAL_REGION_COLORS,
      labels: ANATOMICAL_REGION_LABELS,
    }),
  )

  const data: RadialBarData = [
    {
      data: energySystemData,
      id: 'Energy System',
    },
    {
      data: anatomicalRegionData,
      id: 'Anatomical Region',
    },
  ]

  const totals = {
    'Energy System': energySystemData.reduce((sum, item) => sum + item.y, 0),
    'Anatomical Region': anatomicalRegionData.reduce((sum, item) => sum + item.y, 0),
  }

  const legendData = [
    {
      color: ENERGY_SYSTEM_COLORS['Anaerobic Alactic'],
      id: 'Anaerobic Alactic',
      label: ENERGY_SYSTEM_LABELS['Anaerobic Alactic'],
    },
    {
      color: ENERGY_SYSTEM_COLORS.Aerobic,
      id: 'Aerobic',
      label: ENERGY_SYSTEM_LABELS.Aerobic,
    },
    {
      color: ENERGY_SYSTEM_COLORS['Anaerobic Lactic'],
      id: 'Anaerobic Lactic',
      label: ENERGY_SYSTEM_LABELS['Anaerobic Lactic'],
    },
    {
      color: ANATOMICAL_REGION_COLORS.Arms,
      id: 'Arms',
      label: ANATOMICAL_REGION_LABELS.Arms,
    },
    {
      color: ANATOMICAL_REGION_COLORS.Fingers,
      id: 'Fingers',
      label: ANATOMICAL_REGION_LABELS.Fingers,
    },
    {
      color: ANATOMICAL_REGION_COLORS.General,
      id: 'General',
      label: ANATOMICAL_REGION_LABELS.General,
    },
  ]

  return { colors, data, legendData, totals }
}

function countDefinedValues<T extends DistributionKey>(values: (T | undefined)[]): Map<T, number> {
  const counts = new Map<T, number>()
  for (const value of values)
    if (value !== undefined) counts.set(value, (counts.get(value) ?? 0) + 1)

  return counts
}

function buildRingData<T extends DistributionKey>(
  keys: readonly T[],
  counts: Map<T, number>,
  labels: Record<T, string>,
) {
  return keys
    .map(key => ({ x: labels[key], y: counts.get(key) ?? 0 }))
    .filter(item => item.y > 0)
    .toSorted((a, b) => b.y - a.y)
}

function buildColors<T extends DistributionKey>(
  keys: readonly T[],
  counts: Map<T, number>,
  palette: DistributionPalette<T>,
): Record<string, string> {
  return Object.fromEntries(
    keys
      .filter(key => (counts.get(key) ?? 0) > 0)
      .map(key => [palette.labels[key], palette.colors[key]]),
  )
}
