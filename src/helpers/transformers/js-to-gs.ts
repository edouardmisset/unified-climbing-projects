/* ---------------------------------------------
 *                   TRANSFORMS
 *
 *            JavaScript => Google Sheet
 * ---------------------------------------------
 */

import type { ClimbingAttempt } from './gs-to-js.ts'
import type { JSAscentKeys, JSTrainingKeys } from './headers.ts'

type TransformFunctionJSToGS = (value: string) => string

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
  if (style === 'Redpoint' && tries === 1)
    throw new Error(
      '1 try means Flash or Onsight. It cannot be a Redpoint ascent',
    )

  if ((style === 'Flash' || style === 'Onsight') && tries !== 1)
    throw new Error(
      'Flash or Onsight ascents should have their number of tries equal to 1',
    )

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

type TransformFunctionMappingJSToGS = Partial<
  Record<JSAscentKeys | JSTrainingKeys, TransformFunctionJSToGS>
>

export const TRANSFORM_FUNCTIONS_JS_TO_GS = {
  date: transformDateJSToGS,
  height: transformHeightJSToGS,
  rating: transformRatingJSToGS,
  sessionType: transformSessionTypeJSToGS,
  // You need to catch the case for the `style` property not being mapped to
  // anything
} satisfies TransformFunctionMappingJSToGS
