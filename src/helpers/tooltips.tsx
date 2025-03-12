import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
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

export function TrainingInWeekDescription({
  sessions,
}: { sessions: TrainingSession[] }) {
  if (sessions.length === 0 || sessions[0] === undefined) return <span />

  return sessions.map(({ sessionType, climbingDiscipline, gymCrag, load }) => (
    <div key={`${sessionType}-${gymCrag}-${load}`}>
      {fromClimbingDisciplineToEmoji(climbingDiscipline)} {sessionType} (
      {gymCrag}) - {load === undefined ? '' : roundToTen(load)}%
    </div>
  ))
}

export function TrainingDayPopoverDescription({
  trainingSession,
}: { trainingSession: TrainingSession }) {
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
    `${cragEmoji} ${sessionText}`,
    `${volumeText} ${intensityText} ${loadText} ${anatomicalRegionEmoji} ${energySystemEmoji}`,
    commentText,
  ]
    .filter(s => s !== '')
    .map(str => <p key={str}>{str}</p>)
}

// ASCENT

export function createAscentTooltip(
  ascent: Ascent,
  options?: { showDetails?: boolean },
): string {
  const { showDetails = true } = options ?? {}
  const {
    area,
    climbingDiscipline,
    comments,
    crag,
    date,
    height,
    holds,
    personalGrade,
    profile,
    rating,
    routeName,
    style,
    topoGrade,
    tries,
  } = ascent

  return `${formatDateInTooltip(date)}

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

export function AscentInWeekDescription({ ascents }: { ascents: Ascent[] }) {
  if (ascents.length === 0 || ascents[0] === undefined) return <span />

  return ascents.map(({ routeName, topoGrade, climbingDiscipline, crag }) => (
    <div key={routeName}>
      {fromClimbingDisciplineToEmoji(climbingDiscipline)} {routeName} ({crag}) -{' '}
      {topoGrade}
    </div>
  ))
}

export function AscentsInDayPopoverDescription({
  ascents,
}: { ascents?: Ascent[] }) {
  if (ascents === undefined || ascents[0] === undefined) {
    return ''
  }

  const ascentsCount = ascents.length
  const isMultipleAscents = ascentsCount > 1
  const includeRoute = ascents.some(
    ascent => ascent.climbingDiscipline === 'Route',
  )

  const header = isMultipleAscents
    ? `${ascentsCount} ${includeRoute ? 'Routes' : 'Boulders'}`
    : ''

  const lines = [
    header,
    ...ascents.map(
      ({ routeName, topoGrade, climbingDiscipline, crag }) =>
        `${fromClimbingDisciplineToEmoji(climbingDiscipline)} ${routeName} (${crag}) - ${topoGrade}`,
    ),
  ].filter(s => s !== '')

  return lines.map(s => <div key={s}>{s}</div>)
}
