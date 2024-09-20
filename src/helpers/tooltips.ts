import type { Ascent } from '~/types/ascent'
import type { TrainingSession } from '~/types/training'

export const createAscentTooltip = (ascents: Ascent[]): string =>
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

export const createTrainingTooltip = ({
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
}: TrainingSession): string => {
  const localeDate = `📅 ${date.toLocaleString(undefined, {
    day: 'numeric',
    weekday: 'long',
    month: 'long',
  })}`
  const cragEmoji = gymCrag
    ? `\t${
        climbingDiscipline === 'Boulder'
          ? '🪨'
          : climbingDiscipline === 'Route'
            ? '🧗'
            : climbingDiscipline === 'Multi-Pitch'
              ? '⛰️'
              : ''
      } ${gymCrag}`
    : ''
  const sessionText = sessionType ? ` (${sessionType})` : ''
  const volumeText = volume ? `Volume: ${volume}%` : ''
  const intensityText = intensity ? `Intensity: ${intensity}%` : ''
  const loadText = load ? `Load: ${roundToTen(load)}%` : ''
  const commentText = comments ? `💬 “${comments}”` : ''
  const anatomicalRegionEmoji =
    anatomicalRegion === undefined
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
  const energySystemEmoji =
    energySystem === undefined
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
