import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { type DATE_TIME_OPTIONS, formatDateTime } from './format-date'
import { formatOrdinals } from './format-plurals'

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

  return `📍 ${crag}${showDetails && area ? ` ▸ ${area}` : ''}`
}

export function formatRating(rating: Ascent['rating']) {
  return rating === undefined
    ? ''
    : Array.from({ length: rating }, () => '⭐').join('')
}

export function formatProfile(profile: Ascent['profile']) {
  return profile ? `📐 ${profile}` : ''
}

export function prettyLongDate(
  date: string,
  options: keyof typeof DATE_TIME_OPTIONS = 'longDate',
) {
  return `📅 ${formatDateTime(new Date(date), options)}`
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

// EMOJIS

type Emoji = string

const ASCENT_STYLE_TO_EMOJI: Record<Ascent['style'], Emoji> = {
  Flash: '🔦',
  Onsight: '👁️',
  Redpoint: '🔴',
}

export function fromAscentStyleToEmoji(style: Ascent['style']): Emoji {
  return style === undefined
    ? ASCENT_STYLE_TO_EMOJI.Redpoint
    : (ASCENT_STYLE_TO_EMOJI[style] ?? ASCENT_STYLE_TO_EMOJI.Redpoint)
}

const ENERGY_SYSTEM_TO_EMOJI: Record<
  Exclude<TrainingSession['energySystem'], undefined>,
  Emoji
> = {
  AA: '🔥',
  AE: '🫀',
  AL: '🪫',
}

export function fromEnergySystemToEmoji(
  energySystem: TrainingSession['energySystem'],
): Emoji | '' {
  return energySystem === undefined
    ? ''
    : (ENERGY_SYSTEM_TO_EMOJI[energySystem] ?? '')
}

const ANATOMICAL_REGION_TO_EMOJI: Record<
  Exclude<TrainingSession['anatomicalRegion'], undefined>,
  Emoji
> = {
  Ar: '💪',
  Fi: '🖐️',
  Ge: '🦵',
}

export function fromAnatomicalRegionToEmoji(
  anatomicalRegion: TrainingSession['anatomicalRegion'],
): Emoji | '' {
  return anatomicalRegion === undefined
    ? ''
    : (ANATOMICAL_REGION_TO_EMOJI[anatomicalRegion] ?? '')
}

const CLIMBING_DISCIPLINE_TO_EMOJI: Record<
  NonNullable<TrainingSession['climbingDiscipline']>,
  Emoji
> = {
  Boulder: '🪨',
  'Multi-Pitch': '⛰️',
  Route: '🧗',
}

export function fromClimbingDisciplineToEmoji(
  climbingDiscipline: TrainingSession['climbingDiscipline'],
): Emoji | '' {
  return climbingDiscipline === undefined
    ? ''
    : (CLIMBING_DISCIPLINE_TO_EMOJI[climbingDiscipline] ?? '')
}
