import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { getWeekNumber } from './date'
import {
  formatComments,
  formatCragAndArea,
  formatCragAndDiscipline,
  formatDateInTooltip,
  formatGrades,
  formatHeight,
  formatHolds,
  formatProfile,
  formatRating,
  formatStyleAndTriers,
  fromAnatomicalRegionToEmoji,
  fromClimbingDisciplineToEmoji,
  fromEnergySystemToEmoji,
} from './formatters'
import { roundToTen } from './math'

// TRAINING

export function createTrainingBarCodeTooltip(
  sessions: TrainingSession[],
): string | undefined {
  return sessions.length > 0 && sessions[0] !== undefined
    ? `Week # ${getWeekNumber(new Date(sessions[0].date))}
# Training (${sessions.length}):
${sessions
  .map(
    ({ sessionType, climbingDiscipline, gymCrag, load }) =>
      `${fromClimbingDisciplineToEmoji(climbingDiscipline)} ${sessionType} (${gymCrag}) - ${load === undefined ? '' : roundToTen(load)}%`,
  )
  .join('\n')}`
    : undefined
}

export function createTrainingQRTooltip(
  trainingSession: TrainingSession,
): string {
  const {
    anatomicalRegion,
    climbingDiscipline,
    comments,
    energySystem,
    gymCrag,
    intensity,
    load,
    sessionType,
    volume,
  } = trainingSession

  const localeDate = formatDateInTooltip(trainingSession, 'longDate')
  const cragEmoji = formatCragAndDiscipline({
    gymCrag,
    climbingDiscipline,
  })
  const sessionText = sessionType ? ` (${sessionType})` : ''
  const volumeText = volume === undefined ? '' : `Volume: ${volume}%`
  const intensityText =
    intensity === undefined ? '' : `Intensity: ${intensity}%`
  const loadText = load === undefined ? '' : `Load: ${roundToTen(load)}%`
  const commentText = formatComments(comments)
  const anatomicalRegionEmoji =
    anatomicalRegion === undefined
      ? ''
      : `| ${fromAnatomicalRegionToEmoji(anatomicalRegion)}`
  const energySystemEmoji =
    energySystem === undefined
      ? ''
      : `| ${fromEnergySystemToEmoji(energySystem)}`

  return [
    `${localeDate} ${cragEmoji} ${sessionText}`,
    `${volumeText} ${intensityText} ${loadText} ${anatomicalRegionEmoji} ${energySystemEmoji}`,
    commentText,
  ]
    .filter(s => s !== '')
    .join('\n\n')
}

// ASCENT

export function createAscentTooltip(
  ascent: Ascent,
  options?: { showDetails?: boolean },
): string {
  const { showDetails = true } = options ?? {}
  const {
    climbingDiscipline,
    topoGrade,
    routeName,
    crag,
    comments,
    tries,
    area,
    height,
    holds,
    personalGrade,
    profile,
    rating,
    style,
  } = ascent

  return `${formatDateInTooltip(ascent)}

${fromClimbingDisciplineToEmoji(climbingDiscipline)} ${routeName} ${formatCragAndArea(crag, area, { showDetails })} ${formatGrades({ topoGrade, personalGrade, showDetails })} ${formatStyleAndTriers({ style, tries, options: { showDetails } })}

${
  showDetails
    ? [
        formatHeight(height),
        formatProfile(profile),
        formatHolds(holds),
        formatRating(rating),
        formatComments(comments),
      ]
        .filter(string => string !== '')
        .join('\n')
    : ''
}`
}

export function createAscentBarCodeTooltip(ascents: Ascent[]): string {
  return ascents.length > 0 && ascents[0] !== undefined
    ? `Week # ${getWeekNumber(new Date(ascents[0].date))}
Ascents (${ascents.length}):
${ascents
  .map(
    ({ routeName, topoGrade, climbingDiscipline, crag }) =>
      `${fromClimbingDisciplineToEmoji(climbingDiscipline)} ${routeName} (${crag}) - ${topoGrade}`,
  )
  .join('\n')}`
    : ''
}

export function createAscentsQRTooltip(ascents: Ascent[] | undefined): string {
  if (ascents === undefined || ascents[0] === undefined) {
    return ''
  }

  const ascentsCount = ascents.length
  const isMultipleAscents = ascentsCount > 1
  const includeRoute = ascents.some(
    ascent => ascent.climbingDiscipline === 'Route',
  )

  return `${formatDateInTooltip(ascents[0])}
${
  isMultipleAscents
    ? `${includeRoute ? 'Routes' : 'Boulders'} (${ascentsCount})`
    : ''
}
${ascents
  .map(
    ({ routeName, topoGrade, climbingDiscipline, crag }) =>
      `${fromClimbingDisciplineToEmoji(climbingDiscipline)} ${routeName} (${crag}) - ${topoGrade}`,
  )
  .join('\n')}`
}
