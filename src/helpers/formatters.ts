import {
  type Ascent,
  BOULDERING,
  DEEP_WATER_SOLOING,
  FLASH,
  MULTI_PITCH,
  ONSIGHT,
  REDPOINT,
  SPORT,
} from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { buildDateTimeFormat } from './format-date'
import { formatOrdinals } from './format-plurals'

export function formatComments(
  comments: Ascent['comments'] | TrainingSession['comments'],
): string {
  return comments ? `💬 “${comments}”` : ''
}

export function formatHeight(height: Ascent['height']): string {
  return height ? `📏 ${height}m` : ''
}

export function formatHolds(holds: Ascent['holds']): string {
  return holds ? `✊ ${holds}` : ''
}

export function formatCragAndArea(
  crag: Ascent['crag'],
  area: Ascent['area'],
  options?: { showDetails?: boolean },
): string {
  const { showDetails = true } = options ?? {}

  return `📍 ${crag}${showDetails && area ? ` ▸ ${area}` : ''}`
}

export function formatRating(rating: Ascent['rating']): string {
  return rating === undefined
    ? ''
    : Array.from({ length: rating }, () => '⭐').join('')
}

export function formatProfile(profile: Ascent['profile']): string {
  return profile ? `📐 ${profile}` : ''
}

export const formatLongDate = buildDateTimeFormat('longDate')
export const formatShortDate = buildDateTimeFormat('shortDate')

export function prettyLongDate(date: string): string {
  return date === '' ? '' : `📅 ${formatLongDate(date)}`
}
export function prettyShortDate(date: string): string {
  return `📅 ${formatShortDate(date)}`
}

export function formatStyleAndTriers({
  style,
  tries,
  options,
}: {
  style: Ascent['style']
  tries: Ascent['tries']
  options?: { showDetails?: boolean }
}): string {
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
  [FLASH]: '🔦',
  [ONSIGHT]: '👁️',
  [REDPOINT]: '🔴',
}

export function fromAscentStyleToEmoji(style: Ascent['style']): Emoji {
  return style === undefined
    ? ASCENT_STYLE_TO_EMOJI[REDPOINT]
    : (ASCENT_STYLE_TO_EMOJI[style] ?? ASCENT_STYLE_TO_EMOJI[REDPOINT])
}

const CLIMBING_DISCIPLINE_TO_EMOJI: Record<
  NonNullable<TrainingSession['discipline']>,
  Emoji
> = {
  [BOULDERING]: '🪨',
  [MULTI_PITCH]: '⛰️',
  [SPORT]: '🧗',
  [DEEP_WATER_SOLOING]: '🌊',
}

export function fromClimbingDisciplineToEmoji(
  discipline: TrainingSession['discipline'],
): Emoji | '' {
  return discipline === undefined
    ? ''
    : (CLIMBING_DISCIPLINE_TO_EMOJI[discipline] ?? '')
}
