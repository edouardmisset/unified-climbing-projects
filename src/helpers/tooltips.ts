import type { Ascent, Grade } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { type DATE_TIME_OPTIONS, formatDateTime, getWeeksInYear } from './date'

export const createAscentBarCodeTooltip = (ascents: Ascent[]): string =>
  ascents.length > 0 && ascents[0] !== undefined
    ? `Week # ${getWeeksInYear(new Date(ascents[0].date).getFullYear())}
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
    ? `Week # ${getWeeksInYear(new Date(sessions[0].date).getFullYear())}
# Training (${sessions.length}):
${sessions
  .map(
    ({ sessionType, climbingDiscipline, gymCrag, load }) =>
      `${createClimbingDisciplineEmoji(climbingDiscipline)} ${sessionType} (${gymCrag}) - ${load === undefined ? '' : roundToTen(load)}%`,
  )
  .join('\n')}`
    : ''

export const createAscentsQRTooltip = (
  ascents: Ascent[] | undefined,
): string => {
  if (ascents === undefined || ascents[0] === undefined) {
    return ''
  }

  const ascentsCount = ascents.length
  const isMultipleAscents = ascentsCount > 1
  const includeRoute = ascents.some(
    ascent => ascent.climbingDiscipline === 'Route',
  )

  return `${formatDateProperty(ascents[0])}
${
  isMultipleAscents
    ? `${includeRoute ? 'Routes' : 'Boulders'} (${ascentsCount})`
    : ''
}
${ascents
  .map(
    ({ routeName, topoGrade, climbingDiscipline, crag }) =>
      `${createClimbingDisciplineEmoji(climbingDiscipline)} ${routeName} (${crag}) - ${topoGrade}`,
  )
  .join('\n')}`
}

export const createTrainingQRTooltip = (
  trainingSession: TrainingSession,
): string => {
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

  const localeDate = formatDateProperty(trainingSession, 'longDate')
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

export function formatDateProperty<T>(
  data: T & { date: string },
  options: keyof typeof DATE_TIME_OPTIONS = 'longDate',
) {
  return `📅 ${formatDateTime(new Date(data.date), options)}`
}

export const createAscentTooltip = (
  ascent: Ascent,
  options?: { showDetails?: boolean },
): string => {
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

  return `${formatDateProperty(ascent)}

${createClimbingDisciplineEmoji(climbingDiscipline)} ${routeName} ${formatCragAndArea(crag, area, { showDetails })} ${formatGrade({ topoGrade, personalGrade, showDetails })} ${formatStyleAndTriers(style, tries, { showDetails })}

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

function formatComments(
  comments: Ascent['comments'] | TrainingSession['comments'],
) {
  return comments ? `💬 “${comments}”` : ''
}
function formatHeight(height: Ascent['height']) {
  return height ? `📏 ${height}m` : ''
}
function formatHolds(holds: Ascent['holds']) {
  return holds ? `✊ ${holds}` : ''
}

function formatCragAndArea(
  crag: Ascent['crag'],
  area: Ascent['area'],
  options?: { showDetails?: boolean },
) {
  const { showDetails = true } = options ?? {}

  return `📍 ${crag}${showDetails && area ? ` > ${area}` : ''}`
}
function formatRating(rating: Ascent['rating']) {
  return rating === undefined
    ? ''
    : Array.from({ length: rating }, () => '⭐').join('')
}
function formatGrade({
  topoGrade,
  personalGrade,
  showDetails = true,
}: {
  topoGrade: Grade
  personalGrade?: Grade
  showDetails?: boolean
}) {
  if (topoGrade === undefined) {
    return ''
  }

  const maybePersonalGrade =
    personalGrade === undefined || personalGrade === topoGrade || !showDetails
      ? ''
      : `(${personalGrade})`

  return `⚡︎ ${topoGrade} ${maybePersonalGrade}`.trim()
}

function formatProfile(profile: Ascent['profile']) {
  return profile ? `📐 ${profile}` : ''
}

const enOrdinalRules = new Intl.PluralRules('en-US', { type: 'ordinal' })
const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
])
const formatOrdinals = (number_: number) => {
  const rule = enOrdinalRules.select(number_)
  const suffix = suffixes.get(rule)
  return `${number_}${suffix}`
}

function formatStyleAndTriers(
  style: Ascent['style'],
  tries: Ascent['tries'],
  options?: { showDetails?: boolean },
) {
  const { showDetails = false } = options ?? {}

  const styleEmoji = style === 'Onsight' ? '👁️' : style === 'Flash' ? '🔦' : '🔴'
  const styleText = showDetails ? style : ''

  const triesText = tries > 1 ? `(${formatOrdinals(tries)})` : ''

  return [styleEmoji, styleText, triesText]
    .filter(string => string !== '')
    .join(' ')
}
