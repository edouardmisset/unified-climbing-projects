import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/types/training'

export const createAscentBarCodeTooltip = (ascents: Ascent[]): string =>
  ascents.length > 0 && ascents[0] !== undefined
    ? `Week # ${ascents[0].date.weekOfYear.toString()}
Ascents (${ascents.length}):
${ascents
  .map(
    ({ routeName, topoGrade, climbingDiscipline, crag }) =>
      `${climbingDiscipline === 'Boulder' ? '🪨' : ''}${
        climbingDiscipline === 'Route' ? '🧗' : ''
      } ${routeName} (${crag}) - ${topoGrade}`,
  )
  .join('\n')}`
    : ''

export const createTrainingBarCodeTooltip = (
  sessions: TrainingSession[],
): string =>
  sessions.length > 0 && sessions[0] !== undefined
    ? `Week # ${sessions[0].date.weekOfYear.toString()}
# Training (${sessions.length}):
${sessions
  .map(
    ({ sessionType, climbingDiscipline, gymCrag, load }) =>
      `${createClimbingDisciplineEmoji(climbingDiscipline)} ${sessionType} (${gymCrag}) - ${load === undefined ? '' : roundToTen(load)}%`,
  )
  .join('\n')}`
    : ''

export const createAscentQRTooltip = (ascents: Ascent[]): string =>
  ascents[0] === undefined
    ? ''
    : `📅 ${ascents[0].date.toLocaleString(undefined, {
        day: 'numeric',
        weekday: 'long',
        month: 'long',
      })}
${
  ascents.some(ascent => ascent.climbingDiscipline === 'Route')
    ? 'Routes'
    : 'Boulders'
} (${ascents.length}):
${ascents
  .map(
    ({ routeName, topoGrade, climbingDiscipline, crag }) =>
      `${climbingDiscipline === 'Boulder' ? '🪨' : ''}${
        climbingDiscipline === 'Route' ? '🧗' : ''
      } ${routeName} (${crag}) - ${topoGrade}`,
  )
  .join('\n')}`

export const createTrainingQRTooltip = (
  trainingSession: TrainingSession,
): string => {
  const {
    anatomicalRegion,
    climbingDiscipline,
    comments,
    date,
    energySystem,
    gymCrag,
    intensity,
    load,
    sessionType,
    volume,
  } = trainingSession

  const localeDate = `📅 ${date.toLocaleString(undefined, {
    day: 'numeric',
    weekday: 'long',
    month: 'long',
  })}`
  const cragEmoji = createCragEmoji({ gymCrag, climbingDiscipline })
  const sessionText = sessionType ? ` (${sessionType})` : ''
  const volumeText = volume ? `Volume: ${volume}%` : ''
  const intensityText = intensity ? `Intensity: ${intensity}%` : ''
  const loadText = load ? `Load: ${roundToTen(load)}%` : ''
  const commentText = comments ? `💬 “${comments}”` : ''
  const anatomicalRegionEmoji = createAnatomicalRegionEmoji(anatomicalRegion)
  const energySystemEmoji = createEnergySystemEmoji(energySystem)

  return [
    `${localeDate} ${cragEmoji} ${sessionText}`,
    `${volumeText} ${intensityText} ${loadText} ${anatomicalRegionEmoji} ${energySystemEmoji}`,
    commentText,
  ]
    .filter(s => s !== '')
    .join('\n\n')
}

const roundTo = (powerOfTen: number) => (numberToRound: number) =>
  Math.round(numberToRound / powerOfTen) * powerOfTen

export const roundToTen = roundTo(10)

function createEnergySystemEmoji(
  energySystem: TrainingSession['energySystem'],
) {
  return energySystem === undefined
    ? ''
    : `| ${
        energySystem === 'AA'
          ? '🔥'
          : energySystem === 'AL'
            ? '🪫'
            : energySystem === 'AE'
              ? '🫀'
              : ''
      }`
}

function createAnatomicalRegionEmoji(
  anatomicalRegion: TrainingSession['anatomicalRegion'],
) {
  return anatomicalRegion === undefined
    ? ''
    : `| ${
        anatomicalRegion === 'Ar'
          ? '💪'
          : anatomicalRegion === 'Fi'
            ? '🖐️'
            : anatomicalRegion === 'Ge'
              ? '🦵'
              : ''
      }`
}

function createClimbingDisciplineEmoji(
  climbingDiscipline: TrainingSession['climbingDiscipline'],
) {
  return climbingDiscipline === 'Boulder'
    ? '🪨'
    : climbingDiscipline === 'Route'
      ? '🧗'
      : climbingDiscipline === 'Multi-Pitch'
        ? '⛰️'
        : ''
}

function createCragEmoji({
  gymCrag,
  climbingDiscipline,
}: Pick<TrainingSession, 'gymCrag' | 'climbingDiscipline'>) {
  return gymCrag === undefined
    ? ''
    : `\t${createClimbingDisciplineEmoji(climbingDiscipline)} ${gymCrag}`
}
