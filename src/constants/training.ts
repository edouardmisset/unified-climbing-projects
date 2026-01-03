import type { TrainingSession } from '~/schema/training'

/**
 * Training session types. We purposefully omit "Sg", "FB", "Co" and "Ro" from
 * this list as these are specific training and not climbing training.
 */
export const INDOOR_SESSION_TYPES = [
  'En',
  'PE',
  'SE',
  'MS',
  'Po',
  'SE',
  'Sk',
  'St',
  'Ta',
] as const satisfies TrainingSession['sessionType'][]

export const TRAINING_SESSION_TYPE_TO_BACKGROUND_COLOR: Record<
  NonNullable<TrainingSession['sessionType']>,
  string
> = {
  Out: 'var(--outdoor)',

  CS: 'var(--strength)',
  MS: 'var(--strength)',
  Po: 'var(--strength)',

  PE: 'var(--endurance)',
  En: 'var(--endurance)',
  SE: 'var(--endurance)',

  Sk: 'var(--stamina)',
  St: 'var(--stamina)',

  Ta: 'var(--tapered)',

  Co: 'var(--otherTraining)',
  Ro: 'var(--otherTraining)',
  FB: 'var(--otherTraining)',
  Sg: 'var(--otherTraining)',
} as const satisfies Record<NonNullable<TrainingSession['sessionType']>, string>

export const TRAINING_SESSION_TYPE_TO_CLASS_NAME: Record<
  NonNullable<TrainingSession['sessionType']>,
  string
> = {
  Co: 'otherTraining',

  CS: 'strength',

  En: 'endurance',
  FB: 'otherTraining',
  MS: 'strength',
  Out: 'outdoor',
  PE: 'endurance',
  Po: 'strength',
  Ro: 'otherTraining',
  SE: 'endurance',
  Sg: 'otherTraining',

  Sk: 'stamina',
  St: 'stamina',

  Ta: 'tapered',
} as const satisfies Record<NonNullable<TrainingSession['sessionType']>, string>

export const TRAINING_SESSION_TYPE_TO_STRING = {
  Co: 'otherTraining',
  CS: 'strength',
  En: 'endurance',
  FB: 'otherTraining',
  MS: 'strength',
  Out: 'outdoor',
  PE: 'endurance',
  Po: 'strength',
  Ro: 'otherTraining',
  SE: 'endurance',
  Sg: 'otherTraining',
  Sk: 'stamina',
  St: 'stamina',
  Ta: 'tapered',
} as const satisfies Record<NonNullable<TrainingSession['sessionType']>, string>
