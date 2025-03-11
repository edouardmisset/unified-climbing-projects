import type { Ascent, Grade } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { addParenthesis } from './add-parenthesis'
import { type DATE_TIME_OPTIONS, formatDateTime, getWeekNumber } from './date'
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

// EMOJIS

type emoji = string

const ASCENT_STYLE_TO_EMOJI: Record<Ascent['style'], emoji> = {
  Onsight: '👁️',
  Flash: '🔦',
  Redpoint: '🔴',
}

function fromAscentStyleToEmoji(style: Ascent['style']): emoji {
  return style === undefined
    ? ASCENT_STYLE_TO_EMOJI.Redpoint
    : (ASCENT_STYLE_TO_EMOJI[style] ?? ASCENT_STYLE_TO_EMOJI.Redpoint)
}

const ENERGY_SYSTEM_TO_EMOJI: Record<
  Exclude<TrainingSession['energySystem'], undefined>,
  emoji
> = {
  AA: '🔥',
  AL: '🪫',
  AE: '🫀',
}

function fromEnergySystemToEmoji(
  energySystem: TrainingSession['energySystem'],
): emoji | '' {
  return energySystem === undefined
    ? ''
    : (ENERGY_SYSTEM_TO_EMOJI[energySystem] ?? '')
}

const ANATOMICAL_REGION_TO_EMOJI: Record<
  Exclude<TrainingSession['anatomicalRegion'], undefined>,
  emoji
> = {
  Ar: '💪',
  Fi: '🖐️',
  Ge: '🦵',
}

function fromAnatomicalRegionToEmoji(
  anatomicalRegion: TrainingSession['anatomicalRegion'],
): emoji | '' {
  return anatomicalRegion === undefined
    ? ''
    : (ANATOMICAL_REGION_TO_EMOJI[anatomicalRegion] ?? '')
}

const CLIMBING_DISCIPLINE_TO_EMOJI: Record<
  NonNullable<TrainingSession['climbingDiscipline']>,
  emoji
> = {
  Boulder: '🪨',
  Route: '🧗',
  'Multi-Pitch': '⛰️',
}

export function fromClimbingDisciplineToEmoji(
  climbingDiscipline: TrainingSession['climbingDiscipline'],
): emoji | '' {
  return climbingDiscipline === undefined
    ? ''
    : (CLIMBING_DISCIPLINE_TO_EMOJI[climbingDiscipline] ?? '')
}

// FORMATTERS

export function formatComments(
  comments: Ascent['comments'] | TrainingSession['comments'],
) {
  return comments ? `💬 “${comments}”` : ''
}

export function formatHeight(height: Ascent['height']) {
  return height ? `📏 ${height}m` : ''
}

export function formatHolds(holds: Ascent['holds']) {
  return holds ? `✊ ${holds}` : ''
}

export function formatCragAndArea(
  crag: Ascent['crag'],
  area: Ascent['area'],
  options?: { showDetails?: boolean },
) {
  const { showDetails = true } = options ?? {}

  return `📍 ${crag}${showDetails && area ? ` > ${area}` : ''}`
}

function formatCragAndDiscipline({
  gymCrag,
  climbingDiscipline,
}: Pick<TrainingSession, 'gymCrag' | 'climbingDiscipline'>): emoji {
  return gymCrag === undefined
    ? ''
    : `\t${fromClimbingDisciplineToEmoji(climbingDiscipline)} ${gymCrag}`
}

export function formatRating(rating: Ascent['rating']) {
  return rating === undefined
    ? ''
    : Array.from({ length: rating }, () => '⭐').join('')
}

function formatGrades({
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
      : addParenthesis(personalGrade)

  return `⚡︎ ${topoGrade} ${maybePersonalGrade}`.trim()
}

export function formatProfile(profile: Ascent['profile']) {
  return profile ? `📐 ${profile}` : ''
}

export function formatDateInTooltip<T>(
  data: T & { date: string },
  options: keyof typeof DATE_TIME_OPTIONS = 'longDate',
) {
  return `📅 ${formatDateTime(new Date(data.date), options)}`
}

export function formatStyleAndTriers({
  style,
  tries,
  options,
}: {
  style: Ascent['style']
  tries: Ascent['tries']
  options?: { showDetails?: boolean }
}) {
  const { showDetails = false } = options ?? {}

  const styleEmoji = fromAscentStyleToEmoji(style)
  const styleText = showDetails ? style : ''

  const triesText =
    tries > 1
      ? showDetails
        ? `(${tries} tries)`
        : `(${formatOrdinals(tries)})`
      : ''

  return [styleEmoji, styleText, triesText]
    .filter(string => string !== '')
    .join(' ')
}

const englishOrdinalRules = new Intl.PluralRules('en-US', { type: 'ordinal' })
const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
])
function formatOrdinals(number_: number) {
  const rule = englishOrdinalRules.select(number_)
  const suffix = suffixes.get(rule)
  return `${number_}${suffix}`
}
