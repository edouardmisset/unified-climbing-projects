/* ---------------------------------------------
 *                   HEADERS
 * ---------------------------------------------
 */

import { invert } from '@edouardmisset/object'

/**
 * !The order of the headers matters. For this reason we define the headers in
 * the right order in a separate array.
 */
export const ASCENT_HEADERS = [
  'Route Name',
  'Topo Grade',
  '# Tries',
  'My Grade',
  'Height',
  'Profile',
  'Holds',
  'Rating',
  'Route / Boulder',
  'Crag',
  'Area',
  'Departement',
  'Date',
  'Climber',
  'Ascent Comments',
] as const

export const TRANSFORMED_ASCENT_HEADER_NAMES = {
  'Route Name': 'routeName',
  'Topo Grade': 'topoGrade',
  '# Tries': 'tries',
  'My Grade': 'personalGrade',
  Height: 'height',
  Profile: 'profile',
  Holds: 'holds',
  Rating: 'rating',
  'Route / Boulder': 'climbingDiscipline',
  Crag: 'crag',
  Area: 'area',
  Departement: 'region',
  Date: 'date',
  Climber: 'climber',
  'Ascent Comments': 'comments',
} as const satisfies Record<(typeof ASCENT_HEADERS)[number], string>

export type GSAscentKeys = keyof typeof TRANSFORMED_ASCENT_HEADER_NAMES
export type JSAscentKeys =
  (typeof TRANSFORMED_ASCENT_HEADER_NAMES)[GSAscentKeys]

export type GSAscentRecord = Record<GSAscentKeys, string>

export const TRANSFORMED_ASCENT_KEYS = invert(TRANSFORMED_ASCENT_HEADER_NAMES)

/**
 * !The order of the headers matters. For this reason we define the headers in
 * the right order in a separate array.
 */
export const TRAINING_HEADERS = [
  'Date',
  'Type of Session',
  'Volume',
  'Anatomical Region',
  'Energy System',
  'Route / Bouldering',
  'Gym / Crag',
  'Comments',
  'Intensity',
  'LOAD',
] as const

export const TRANSFORMED_TRAINING_HEADER_NAMES = {
  'Anatomical Region': 'anatomicalRegion',
  Comments: 'comments',
  Date: 'date',
  'Energy System': 'energySystem',
  'Gym / Crag': 'gymCrag',
  Intensity: 'intensity',
  LOAD: 'load',
  'Route / Bouldering': 'climbingDiscipline',
  'Type of Session': 'sessionType',
  Volume: 'volume',
} as const satisfies Record<(typeof TRAINING_HEADERS)[number], string>

export type GSTrainingKeys = keyof typeof TRANSFORMED_TRAINING_HEADER_NAMES
export type JSTrainingKeys =
  (typeof TRANSFORMED_TRAINING_HEADER_NAMES)[GSTrainingKeys]

export type GSTrainingRecord = Record<GSTrainingKeys, string>

/**
 * NB: there is one more key (`style`) in the JS object than in the GS headers
 */
export const TRANSFORMED_TRAINING_KEYS = invert(
  TRANSFORMED_TRAINING_HEADER_NAMES,
)
