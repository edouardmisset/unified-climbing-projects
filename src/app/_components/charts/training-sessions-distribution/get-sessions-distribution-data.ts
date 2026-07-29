import { ANATOMICAL_REGIONS, ENERGY_SYSTEMS } from '~/domain/canonical/training-session'
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

export function getSessionsDistributionData(sessions: TrainingSession[]): {
  data: RadialBarData
  colors: Record<string, string>
  legendData: { id: string; label: string; color: string }[]
  totals: Record<string, number>
} {
  if (sessions.length === 0) return { colors: {}, data: [], legendData: [], totals: {} }

  const sessionsWithEnergySystem = sessions.filter(session => session.energySystem !== undefined)

  const sessionsWithRegion = sessions.filter(session => session.anatomicalRegion !== undefined)

  const energySystemCounts = new Map<EnergySystem, number>()
  const regionCounts = new Map<AnatomicalRegion, number>()

  for (const { energySystem } of sessionsWithEnergySystem) {
    if (!energySystem) continue
    energySystemCounts.set(energySystem, (energySystemCounts.get(energySystem) ?? 0) + 1)
  }

  for (const { anatomicalRegion } of sessionsWithRegion) {
    if (!anatomicalRegion) continue
    regionCounts.set(anatomicalRegion, (regionCounts.get(anatomicalRegion) ?? 0) + 1)
  }

  const colors: Record<string, string> = {}

  // Build Energy System ring data
  const energySystemData = ENERGY_SYSTEMS.map(key => ({
    x: ENERGY_SYSTEM_LABELS[key],
    y: energySystemCounts.get(key) ?? 0,
  }))
    .filter(item => item.y > 0)
    .toSorted((a, b) => b.y - a.y)

  for (const key of ENERGY_SYSTEMS) {
    const label = ENERGY_SYSTEM_LABELS[key]
    if ((energySystemCounts.get(key) ?? 0) > 0) colors[label] = ENERGY_SYSTEM_COLORS[key]
  }

  // Build Anatomical Region ring data
  const anatomicalRegionData = ANATOMICAL_REGIONS.map(key => ({
    x: ANATOMICAL_REGION_LABELS[key],
    y: regionCounts.get(key) ?? 0,
  }))
    .filter(item => item.y > 0)
    .toSorted((a, b) => b.y - a.y)

  for (const key of ANATOMICAL_REGIONS) {
    const label = ANATOMICAL_REGION_LABELS[key]
    if ((regionCounts.get(key) ?? 0) > 0) colors[label] = ANATOMICAL_REGION_COLORS[key]
  }

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
