import type { TrainingSession } from '~/schema/training'

export const TRAINING_SESSION_TYPE_TO_BACKGROUND_COLOR: Record<
  NonNullable<TrainingSession['sessionType']>,
  string
> = {
  Co: 'var(--other-training)',

  CS: 'var(--strength)',

  En: 'var(--endurance)',
  FB: 'var(--other-training)',
  MS: 'var(--strength)',
  Out: 'var(--outdoor)',
  PE: 'var(--endurance)',
  Po: 'var(--strength)',
  Ro: 'var(--other-training)',
  SE: 'var(--endurance)',
  Sg: 'var(--other-training)',

  Sk: 'var(--stamina)',
  St: 'var(--stamina)',

  Ta: 'var(--tapered)',
} as const satisfies Record<NonNullable<TrainingSession['sessionType']>, string>

export const TRAINING_SESSION_TYPE_TO_CLASS_NAME: Record<
  NonNullable<TrainingSession['sessionType']>,
  string
> = {
  Co: 'other-training',

  CS: 'strength',

  En: 'endurance',
  FB: 'other-training',
  MS: 'strength',
  Out: 'outdoor',
  PE: 'endurance',
  Po: 'strength',
  Ro: 'other-training',
  SE: 'endurance',
  Sg: 'other-training',

  Sk: 'stamina',
  St: 'stamina',

  Ta: 'tapered',
} as const satisfies Record<NonNullable<TrainingSession['sessionType']>, string>

export const TRAINING_SESSION_TYPE_TO_STRING = {
  Co: 'other-training',
  CS: 'strength',
  En: 'endurance',
  FB: 'other-training',
  MS: 'strength',
  Out: 'outdoor',
  PE: 'endurance',
  Po: 'strength',
  Ro: 'other-training',
  SE: 'endurance',
  Sg: 'other-training',
  Sk: 'stamina',
  St: 'stamina',
  Ta: 'tapered',
} as const satisfies Record<NonNullable<TrainingSession['sessionType']>, string>
