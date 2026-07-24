import type { TrainingSession } from '~/schema/training'

/**
 * Training session types. We purposefully omit Stretching, Finger Board, Core,
 * and Routine from this list as these are specific training and not climbing training.
 */
export const INDOOR_SESSION_TYPES = [
  'Endurance',
  'Power Endurance',
  'Strength Endurance',
  'Max Strength',
  'Power',
  'Strength Endurance',
  'Skill',
  'Stamina',
  'Chill',
] as const satisfies TrainingSession['type'][]

// Training load/intensity constants
export const DEFAULT_INTENSITY_PERCENT = 65
export const DEFAULT_VOLUME_PERCENT = 65

export const TRAINING_SESSION_TYPE_TO_BACKGROUND_COLOR: Record<
  NonNullable<TrainingSession['type']>,
  string
> = {
  Outdoor: 'var(--outdoor)',

  'Contact Strength': 'var(--strength)',
  'Max Strength': 'var(--strength)',
  Power: 'var(--strength)',

  'Power Endurance': 'var(--endurance)',
  Endurance: 'var(--endurance)',
  'Strength Endurance': 'var(--endurance)',

  Skill: 'var(--stamina)',
  Stamina: 'var(--stamina)',

  Chill: 'var(--tapered)',

  Core: 'var(--otherTraining)',
  Routine: 'var(--otherTraining)',
  'Finger Board': 'var(--otherTraining)',
  Stretching: 'var(--otherTraining)',
} as const satisfies Record<NonNullable<TrainingSession['type']>, string>

export const TRAINING_SESSION_TYPE_TO_CLASS_NAME: Record<
  NonNullable<TrainingSession['type']>,
  string
> = {
  Core: 'otherTraining',

  'Contact Strength': 'strength',

  Endurance: 'endurance',
  'Finger Board': 'otherTraining',
  'Max Strength': 'strength',
  Outdoor: 'outdoor',
  'Power Endurance': 'endurance',
  Power: 'strength',
  Routine: 'otherTraining',
  'Strength Endurance': 'endurance',
  Stretching: 'otherTraining',

  Skill: 'stamina',
  Stamina: 'stamina',

  Chill: 'tapered',
} as const satisfies Record<NonNullable<TrainingSession['type']>, string>

export const TRAINING_SESSION_TYPE_TO_STRING = {
  Chill: 'tapered',
  'Contact Strength': 'strength',
  Core: 'otherTraining',
  Endurance: 'endurance',
  'Finger Board': 'otherTraining',
  'Max Strength': 'strength',
  Outdoor: 'outdoor',
  Power: 'strength',
  'Power Endurance': 'endurance',
  Routine: 'otherTraining',
  Skill: 'stamina',
  Stamina: 'stamina',
  'Strength Endurance': 'endurance',
  Stretching: 'otherTraining',
} as const satisfies Record<NonNullable<TrainingSession['type']>, string>
