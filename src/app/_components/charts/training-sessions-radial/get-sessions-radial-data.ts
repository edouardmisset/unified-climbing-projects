import type { TrainingSession } from '~/schema/training'

type RadialBarData = Array<{
  id: string
  data: Array<{
    x: string
    y: number
  }>
}>

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
  legendData: Array<{ id: string; label: string; color: string }>
  totals: Record<string, number>
} {
  if (sessions.length === 0)
    return { colors: {}, data: [], legendData: [], totals: {} }

  const sessionsWithEnergySystem = sessions.filter(
    session => session.energySystem !== undefined,
  )

  const sessionsWithRegion = sessions.filter(
    session => session.anatomicalRegion !== undefined,
  )

  const energySystemCounts = sessionsWithEnergySystem.reduce(
    (acc, { energySystem }) => {
      if (!energySystem) return acc
      acc[energySystem] = (acc[energySystem] ?? 0) + 1
      return acc
    },
    {} as Record<NonNullable<TrainingSession['energySystem']>, number>,
  )

  const regionCounts = sessionsWithRegion.reduce(
    (acc, { anatomicalRegion }) => {
      if (!anatomicalRegion) return acc
      acc[anatomicalRegion] = (acc[anatomicalRegion] ?? 0) + 1
      return acc
    },
    {} as Record<NonNullable<TrainingSession['anatomicalRegion']>, number>,
  )

  const colors: Record<string, string> = {}

  // Build Energy System ring data
  const energySystemData: Array<{ x: string; y: number }> = Object.entries(
    energySystemCounts,
  )
    .map(([system, count]) => ({
      x:
        ENERGY_SYSTEM_LABELS[system as keyof typeof ENERGY_SYSTEM_LABELS] ??
        system,
      y: count,
    }))
    .sort((a, b) => b.y - a.y)

  for (const item of energySystemData) {
    const systemKey = (
      Object.keys(ENERGY_SYSTEM_LABELS) as Array<
        keyof typeof ENERGY_SYSTEM_LABELS
      >
    ).find(key => ENERGY_SYSTEM_LABELS[key] === item.x)
    if (systemKey) {
      colors[item.x] = ENERGY_SYSTEM_COLORS[systemKey]
    }
  }

  // Build Anatomical Region ring data
  const anatomicalRegionData: Array<{ x: string; y: number }> = Object.entries(
    regionCounts,
  )
    .map(([region, count]) => ({
      x:
        ANATOMICAL_REGION_LABELS[
          region as keyof typeof ANATOMICAL_REGION_LABELS
        ] ?? region,
      y: count,
    }))
    .sort((a, b) => b.y - a.y)

  for (const item of anatomicalRegionData) {
    const regionKey = (
      Object.keys(ANATOMICAL_REGION_LABELS) as Array<
        keyof typeof ANATOMICAL_REGION_LABELS
      >
    ).find(key => ANATOMICAL_REGION_LABELS[key] === item.x)
    if (regionKey) {
      colors[item.x] = ANATOMICAL_REGION_COLORS[regionKey]
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
    'Anatomical Region': anatomicalRegionData.reduce(
      (sum, item) => sum + item.y,
      0,
    ),
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
