import { type Ascent } from '~/types/ascent'
import { type TrainingSession } from '~/types/training'

export const createAscentTooltip = (ascents: Ascent[]): string =>
  ascents.length >= 1 ?
    `📅 ${ascents[0]!.date.toLocaleString(undefined, {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
    })}
${
  ascents.some(ascent => ascent.routeOrBoulder === 'Route') ? 'Routes' : (
    'Boulders'
  )
} (${ascents.length}):
${ascents
  .map(
    ({ routeName, topoGrade, routeOrBoulder, crag }) =>
      `${routeOrBoulder === 'Boulder' ? '🪨' : ''}${
        routeOrBoulder === 'Route' ? '🧗' : ''
      } ${routeName} (${crag}) - ${topoGrade}`,
  )
  .join('\n')}`
  : ''

export const createTrainingTooltip = ({
  date,
  routeOrBouldering,
  volume,
  load,
  intensity,
  gymCrag,
  anatomicalRegion,
  energySystem,
  sessionType,
  comments,
}: TrainingSession): string => {
  const localeDate = `📅 ${date.toLocaleString(undefined, {
    day: 'numeric',
    weekday: 'long',
    month: 'long',
  })}`
  const cragEmoji =
    gymCrag ?
      `\t${
        routeOrBouldering === 'Bouldering' ? '🪨'
        : routeOrBouldering === 'Route' ? '🧗'
        : routeOrBouldering === 'Multi-Pitch' ? '⛰️'
        : ''
      } ${gymCrag}`
    : ''
  const sessionText = sessionType ? ` (${sessionType})` : ''
  const volumeText = volume ? `Volume: ${volume}%` : ''
  const intensityText = intensity ? `Intensity: ${intensity}%` : ''
  const loadText = load ? `Load: ${roundToTen(load)}%` : ''
  const commentText = comments ? `💬 “${comments}”` : ''
  const anatomicalRegionEmoji =
    anatomicalRegion === undefined ? '' : (
      `| ${
        anatomicalRegion === 'Ar' ? '💪'
        : anatomicalRegion === 'Fi' ? '🖐️'
        : anatomicalRegion === 'Ge' ? '🦵'
        : ''
      }`
    )
  const energySystemEmoji =
    energySystem === undefined ? '' : (
      `| ${
        energySystem === 'AA' ? '🔥'
        : energySystem === 'AL' ? '🪫'
        : energySystem === 'AE' ? '🫀'
        : ''
      }`
    )

  return [
    `${localeDate} ${cragEmoji} ${sessionText}`,
    `${volumeText} ${intensityText} ${loadText} ${anatomicalRegionEmoji} ${energySystemEmoji}`,
    commentText,
  ]
    .filter(s => s !== '')
    .join('\n\n')
}

export const roundToTen = (n: number): number => Math.round(n / 10) * 10
