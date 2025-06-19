import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { holdsFomGSSchema } from '~/schema/ascent'
import type { JSAscentKeys, JSTrainingKeys } from './headers.ts'

/* ---------------------------------------------
 *                   TRANSFORMS
 *
 *           Google Sheet => JavaScript
 * ---------------------------------------------
 */

type TransformFunctionGSToJS = (value: string) => string | number

/**
 * Transforms a value to a string.
 * @param {string} value - The value to transform.
 * @returns {string} - The transformed string value.
 */
const transformToStringGSToJS: TransformFunctionGSToJS = String

/**
 * Transforms a date string from "DD/MM/YYYY" format to ISO string.
 * @param {string} value - The date string to transform.
 * @returns {string} - The transformed ISO date string.
 */
const transformDateGSToJS = (value: string): string => {
  const [day, month, year] = value.split('/')
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    12,
    0,
  ).toISOString()
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

export type ClimbingAttempt = {
  style: 'Onsight' | 'Flash' | 'Redpoint'
  tries: number
}

/**
 * Transforms a tries string to extract style and number of tries.
 * @param {string} value - The tries string to transform.
 * @returns {{ style: 'Onsight' | 'Flash' | 'Redpoint', tries: number }} - The transformed style and tries.
 */
export function transformTriesGSToJS(value = ''): ClimbingAttempt {
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
 * Filter out climbing hold from Google Sheets schema to JS.
 * @param {string} value - The climbing hold string to transform.
 * @returns {string} - The filtered climbing hold type.
 */
const transformHoldsGSToJS: TransformFunctionGSToJS = value => {
  const parsedValue = holdsFomGSSchema.safeParse(value)

  if (!parsedValue.success) {
    globalThis.console.error(parsedValue.error)
    return ''
  }

  const { data: hold } = parsedValue

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
  default: defaultTransformGSToJS,
} as const satisfies TransformFunctionMappingGSToJS
