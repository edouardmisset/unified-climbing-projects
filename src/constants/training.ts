import type { TrainingSession } from '~/schema/training'

export const TRAINING_SESSION_TYPE_TO_BACKGROUND_COLOR: Record<
  NonNullable<TrainingSession['sessionType']>,
  string
> = {
  Out: 'var(--outdoor)',

  Ta: 'var(--tapered)',

  Co: 'var(--other-training)',
  FB: 'var(--other-training)',
  Ro: 'var(--other-training)',
  Sg: 'var(--other-training)',

  CS: 'var(--strength)',
  Po: 'var(--strength)',
  MS: 'var(--strength)',

  En: 'var(--endurance)',
  PE: 'var(--endurance)',
  SE: 'var(--endurance)',

  Sk: 'var(--stamina)',
  St: 'var(--stamina)',
} as const satisfies Record<NonNullable<TrainingSession['sessionType']>, string>

export const TRAINING_SESSION_TYPE_TO_CLASS_NAME: Record<
  NonNullable<TrainingSession['sessionType']>,
  string
> = {
  Out: 'outdoor',

  Ta: 'tapered',

  Co: 'other-training',
  FB: 'other-training',
  Ro: 'other-training',
  Sg: 'other-training',

  CS: 'strength',
  Po: 'strength',
  MS: 'strength',

  En: 'endurance',
  PE: 'endurance',
  SE: 'endurance',

  Sk: 'stamina',
  St: 'stamina',
} as const satisfies Record<NonNullable<TrainingSession['sessionType']>, string>

export const TRAINING_SESSION_TYPE_TO_STRING = {
  Out: 'outdoor',
  Ta: 'tapered',
  Co: 'other-training',
  FB: 'other-training',
  Ro: 'other-training',
  Sg: 'other-training',
  CS: 'strength',
  Po: 'strength',
  MS: 'strength',
  En: 'endurance',
  PE: 'endurance',
  SE: 'endurance',
  Sk: 'stamina',
  St: 'stamina',
} as const satisfies Record<NonNullable<TrainingSession['sessionType']>, string>
