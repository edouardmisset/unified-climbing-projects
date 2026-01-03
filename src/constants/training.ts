import type { TrainingSession } from '~/schema/training'

export const INDOOR_SESSION_TYPES = [
  'CS',
  'En',
  'MS',
  'PE',
  'Po',
  'SE',
  'Sk',
  'St',
  'Ta',
  'Ro',
  'Sg',
  'Co',
  'FB',
] as const satisfies TrainingSession['sessionType'][]

export const TRAINING_SESSION_TYPE_TO_BACKGROUND_COLOR: Record<
  NonNullable<TrainingSession['sessionType']>,
  string
> = {
  Co: 'var(--otherTraining)',

  CS: 'var(--strength)',

  En: 'var(--endurance)',
  FB: 'var(--otherTraining)',
  MS: 'var(--strength)',
  Out: 'var(--outdoor)',
  PE: 'var(--endurance)',
  Po: 'var(--strength)',
  Ro: 'var(--otherTraining)',
  SE: 'var(--endurance)',
  Sg: 'var(--otherTraining)',

  Sk: 'var(--stamina)',
  St: 'var(--stamina)',

  Ta: 'var(--tapered)',
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
