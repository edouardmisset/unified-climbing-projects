import { isValidNumber } from '@edouardmisset/math'
import { invert } from '@edouardmisset/object'
import { Temporal } from '@js-temporal/polyfill'
import { holdsFomGSSchema } from '~/schema/ascent'
import type { Ascent } from '~/schema/ascent'
import { removeObjectExtendedNullishValues } from './remove-undefined-values'
import { sortKeys } from './sort-keys'

type TransformFunctionGSToJS = (
  value: string,
) => string | number | Temporal.PlainDateTime

/* ---------------------------------------------
 *                   HEADERS
 * ---------------------------------------------
 */

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
type JSAscentKeys = (typeof TRANSFORMED_ASCENT_HEADER_NAMES)[GSAscentKeys]

export type GSAscentRecord = Record<GSAscentKeys, string>

export const TRANSFORMED_ASCENT_KEYS = invert(TRANSFORMED_ASCENT_HEADER_NAMES)

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
} as const

export type GSTrainingKeys = keyof typeof TRANSFORMED_TRAINING_HEADER_NAMES
export type JSTrainingKeys =
  (typeof TRANSFORMED_TRAINING_HEADER_NAMES)[GSTrainingKeys]

/**
 * NB: there is one more key (`style`) in the JS object than in the GS headers
 */

export const TRANSFORMED_TRAINING_KEYS = invert(
  TRANSFORMED_TRAINING_HEADER_NAMES,
)

/* ---------------------------------------------
 *                   TRANSFORMS
 *
 *           Google Sheet => JavaScript
 * ---------------------------------------------
 */

/**
 * Transforms a value to a string.
 * @param {string} value - The value to transform.
 * @returns {string} - The transformed string value.
 */
const transformToStringGSToJS: TransformFunctionGSToJS = value => String(value)

/**
 * Transforms a date string from "DD/MM/YYYY" format to ISO string.
 * @param {string} value - The date string to transform.
 * @returns {string} - The transformed ISO date string.
 */
const transformDateGSToJS = (value: string): string => {
  const [day, month, year] = value.split('/')
  return `${new Temporal.PlainDateTime(
    Number(year),
    Number(month),
    Number(day),
    12,
    0,
  ).toString()}Z`
}

/**
 * Transforms a height string by removing 'm' and converting to a number.
 * @param {string} value - The height string to transform.
 * @returns {number} - The transformed number value.
 */
const transformHeightGSToJS: TransformFunctionGSToJS = value =>
  Number(value.replace('m', ''))

/**
 * Transforms a rating string by removing '*' and converting to a number.
 * @param {string} value - The rating string to transform.
 * @returns {number} - The transformed number value.
 */
const transformRatingGSToJS: TransformFunctionGSToJS = value =>
  Number(value.replaceAll('*', ''))

type ClimbingAttempt = {
  style: 'Onsight' | 'Flash' | 'Redpoint'
  tries: number
}

/**
 * Transforms a tries string to extract style and number of tries.
 * @param {string} value - The tries string to transform.
 * @returns {{ style: 'Onsight' | 'Flash' | 'Redpoint', tries: number }} - The transformed style and tries.
 */
export function transformTriesGSToJS(value: string): ClimbingAttempt {
  const style = value.includes('Onsight')
    ? 'Onsight'
    : value.includes('Flash')
      ? 'Flash'
      : 'Redpoint'

  const tries = Number(
    value.replace('go', '').replace('Onsight', '').replace('Flash', '').trim(),
  )

  return { style, tries }
}

/**
 * Transforms a session type string.
 * @param {string} value - The session type string to transform.
 * @returns {string} - The transformed session type.
 */
const transformSessionTypeGSToJS: TransformFunctionGSToJS = value =>
  value === 'Ex' ? 'Out' : value

/**
 * Transforms a climbing discipline string.
 * @param {string} value - The climbing discipline string to transform.
 * @returns {string} - The transformed climbing discipline.
 */
const transformClimbingDisciplineGSToJS: TransformFunctionGSToJS = value =>
  value === 'Bouldering' ? 'Boulder' : value

/**
 * Filter out climbing hold from Google Sheets schema to JS.
 * @param {string} value - The climbing hold string to transform.
 * @returns {string} - The filtered climbing hold type.
 */
const transformHoldsGSToJS: TransformFunctionGSToJS = value => {
  const hold = holdsFomGSSchema.parse(value)
  if (hold === 'Positive' || hold === 'Volume') return 'Sloper'
  if (hold === 'Mono' || hold === 'Bi') return 'Pocket'
  if (hold === 'Various') return 'Crimp'

  return hold
}

/**
 * Default transformation function that attempts to convert a string to a number.
 * @param {string} value - The value to transform.
 * @returns {string | number} - The transformed value as a number or string.
 */
const defaultTransformGSToJS: TransformFunctionGSToJS = value => {
  const valueAsNumber = Number(value)
  return isValidNumber(valueAsNumber) ? valueAsNumber : value
}

type TransformFunctionMappingGSToJS = Partial<
  Record<JSAscentKeys | JSTrainingKeys | 'default', TransformFunctionGSToJS>
>

export const TRANSFORM_FUNCTIONS_GS_TO_JS = {
  area: transformToStringGSToJS,
  date: transformDateGSToJS,
  height: transformHeightGSToJS,
  holds: transformHoldsGSToJS,
  rating: transformRatingGSToJS,
  routeName: transformToStringGSToJS,
  sessionType: transformSessionTypeGSToJS,
  climbingDiscipline: transformClimbingDisciplineGSToJS,
  default: defaultTransformGSToJS,
} as const satisfies TransformFunctionMappingGSToJS

/**
 * Transforms a raw ascent record from Google Sheets format to a JavaScript
 * object format.
 *
 * @param rawAscent - A record representing a single ascent with keys and values
 * as strings from Google Sheets.
 * @returns A transformed record with keys as strings and values as strings,
 * numbers, or booleans, representing the ascent in JavaScript format.
 */
export function transformAscentFromGSToJS(
  rawAscent: Record<string, string>,
): Record<string, string | number | boolean | Temporal.PlainDateTime> {
  const transformedAscent = Object.entries(rawAscent).reduce(
    (acc, [key, value]) => {
      if (value === '') return acc

      const transformedKey =
        TRANSFORMED_ASCENT_HEADER_NAMES[key as GSAscentKeys]

      if (transformedKey === 'tries') {
        acc[transformedKey] = transformTriesGSToJS(value).tries
        acc.style = transformTriesGSToJS(value).style
      } else {
        const transform =
          TRANSFORM_FUNCTIONS_GS_TO_JS[
            transformedKey as keyof typeof TRANSFORM_FUNCTIONS_GS_TO_JS
          ] ?? TRANSFORM_FUNCTIONS_GS_TO_JS.default
        acc[transformedKey] = transform(value)
      }
      return acc
    },
    {} as Record<string, string | number | boolean | Temporal.PlainDateTime>,
  )

  return sortKeys(removeObjectExtendedNullishValues(transformedAscent))
}

/* ---------------------------------------------
 *                   TRANSFORMS
 *
 *            JavaScript => Google Sheet
 * ---------------------------------------------
 */

export type TransformFunctionJSToGS = (value: string) => string

/**
 * Transforms an ISO date string to "DD/MM/YYYY" format.
 * @param {string} ISODateString - The ISO date string to transform.
 * @returns {string} - The transformed date string in "DD/MM/YYYY" format.
 */
const transformDateJSToGS = (ISODateString: string): string => {
  if (ISODateString === '') return ''
  const date = new Date(ISODateString)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Transforms a height number to a string with 'm'.
 * @param {string} height - The height number to transform.
 * @returns {string} - The transformed height string.
 */
const transformHeightJSToGS = (height: string): string =>
  height === '' ? '' : `${height}m`

/**
 * Transforms a rating number to a string with '*'.
 * @param {string} rating - The rating number to transform.
 * @returns {string} - The transformed rating string.
 */
const transformRatingJSToGS = (rating: string): string =>
  rating === '' ? '' : `${rating}*`

/**
 * Transforms style and number of tries to a tries string.
 * @param {ClimbingAttempt} value - The style and tries to transform.
 * @returns {string} - The transformed tries string.
 */
export const transformTriesJSToGS = ({
  style,
  tries,
}: ClimbingAttempt): string => {
  if (tries < 1) throw new Error('Tries must be greater than 1')
  if (style === 'Redpoint' && tries === 1) {
    throw new Error(
      '1 try means Flash or Onsight but nor Redpoint ascent style',
    )
  }
  if ((style === 'Flash' || style === 'Onsight') && tries !== 1) {
    throw new Error(
      'Flash or Onsight ascents should their number of tries equal to 1',
    )
  }

  if (style === 'Onsight') return '001 Onsight'
  if (style === 'Flash') return '01 Flash'

  return `${tries.toString().padStart(2, '0')} go`
}

/**
 * Transforms a session type string.
 * @param {string} sessionType - The session type string to transform.
 * @returns {string} - The transformed session type.
 */
const transformSessionTypeJSToGS = (sessionType: string): string =>
  sessionType === 'Out' ? 'Ex' : sessionType

/**
 * Transforms a climbing discipline string.
 * @param {string} discipline - The climbing discipline string to transform.
 * @returns {string} - The transformed climbing discipline.
 */
const transformClimbingDisciplineJSToGS = (discipline: string): string =>
  discipline === 'Boulder' ? 'Bouldering' : discipline

type TransformFunctionMappingJSToGS = Partial<
  Record<JSAscentKeys | JSTrainingKeys, TransformFunctionJSToGS>
>

export const TRANSFORM_FUNCTIONS_JS_TO_GS = {
  date: transformDateJSToGS,
  height: transformHeightJSToGS,
  rating: transformRatingJSToGS,
  sessionType: transformSessionTypeJSToGS,
  climbingDiscipline: transformClimbingDisciplineJSToGS,
  // You need to catch the case for the `style` property not being mapped to
  // anything
} satisfies TransformFunctionMappingJSToGS

// Key = JS ascent object's key
// Header = Google Sheet's ascent's header
export function transformAscentFromJSToGS(ascent: Ascent): GSAscentRecord {
  return ASCENT_HEADERS.reduce((accumulator, header) => {
    const key = TRANSFORMED_ASCENT_HEADER_NAMES[header]

    // Special cases
    if (key === 'climber') {
      accumulator.Climber = 'Edouard Misset'
    } else if (key === 'tries') {
      const GSTries = transformTriesJSToGS({
        style: ascent.style,
        tries: ascent.tries,
      })
      accumulator['# Tries'] = GSTries
    } else {
      const rawStringValue = ascent[key]?.toString() ?? ''

      //? how to deal with special chars in comments ?

      const keyAs = key as keyof typeof TRANSFORM_FUNCTIONS_JS_TO_GS
      const transformer =
        keyAs in TRANSFORM_FUNCTIONS_JS_TO_GS
          ? TRANSFORM_FUNCTIONS_JS_TO_GS[keyAs]
          : String

      accumulator[header] = transformer(rawStringValue)
    }

    return accumulator
  }, {} as GSAscentRecord)
}
