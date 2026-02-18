import {
  ANATOMICAL_REGIONS,
  ENERGY_SYSTEMS,
  type AnatomicalRegion,
  type EnergySystem,
  type TrainingSession,
} from '~/schema/training'

type RadialBarData = {
  id: string
  data: {
    x: string
    y: number
  }[]
}[]

const ENERGY_SYSTEM_COLORS = {
  AA: 'var(--energySystemAA)',
  AE: 'var(--energySystemAE)',
  AL: 'var(--energySystemAL)',
} as const

const ENERGY_SYSTEM_LABELS = {
  AA: 'Anaerobic Alactic',
  AE: 'Aerobic',
  AL: 'Anaerobic Lactic',
} as const

const ANATOMICAL_REGION_COLORS = {
  Ar: 'var(--anatomicalRegionAr)',
  Fi: 'var(--anatomicalRegionFi)',
  Ge: 'var(--anatomicalRegionGe)',
} as const

const ANATOMICAL_REGION_LABELS = {
  Ar: 'Arms',
  Fi: 'Fingers',
  Ge: 'General',
} as const

export function getSessionsRadialData(sessions: TrainingSession[]): {
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
    .sort((a, b) => b.y - a.y)

  for (const key of ENERGY_SYSTEMS) {
    const label = ENERGY_SYSTEM_LABELS[key]
    if ((energySystemCounts.get(key) ?? 0) > 0) {
      colors[label] = ENERGY_SYSTEM_COLORS[key]
    }
  }

  // Build Anatomical Region ring data
  const anatomicalRegionData = ANATOMICAL_REGIONS.map(key => ({
    x: ANATOMICAL_REGION_LABELS[key],
    y: regionCounts.get(key) ?? 0,
  }))
    .filter(item => item.y > 0)
    .sort((a, b) => b.y - a.y)

  for (const key of ANATOMICAL_REGIONS) {
    const label = ANATOMICAL_REGION_LABELS[key]
    if ((regionCounts.get(key) ?? 0) > 0) {
      colors[label] = ANATOMICAL_REGION_COLORS[key]
    }
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
      color: ENERGY_SYSTEM_COLORS.AA,
      id: 'AA',
      label: ENERGY_SYSTEM_LABELS.AA,
    },
    {
      color: ENERGY_SYSTEM_COLORS.AE,
      id: 'AE',
      label: ENERGY_SYSTEM_LABELS.AE,
    },
    {
      color: ENERGY_SYSTEM_COLORS.AL,
      id: 'AL',
      label: ENERGY_SYSTEM_LABELS.AL,
    },
    {
      color: ANATOMICAL_REGION_COLORS.Ar,
      id: 'Ar',
      label: ANATOMICAL_REGION_LABELS.Ar,
    },
    {
      color: ANATOMICAL_REGION_COLORS.Fi,
      id: 'Fi',
      label: ANATOMICAL_REGION_LABELS.Fi,
    },
    {
      color: ANATOMICAL_REGION_COLORS.Ge,
      id: 'Ge',
      label: ANATOMICAL_REGION_LABELS.Ge,
    },
  ]

  return { colors, data, legendData, totals }
}
