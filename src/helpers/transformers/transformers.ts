import type { Temporal } from '@js-temporal/polyfill'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/types/training'
import { removeObjectExtendedNullishValues } from '../remove-undefined-values.ts'
import { sortKeys } from '../sort-keys.ts'
import {
  TRANSFORM_FUNCTIONS_GS_TO_JS,
  transformTriesGSToJS,
} from './gs-to-js.ts'
import {
  ASCENT_HEADERS,
  type GSAscentKeys,
  type GSAscentRecord,
  type GSTrainingKeys,
  type GSTrainingRecord,
  TRAINING_HEADERS,
  TRANSFORMED_ASCENT_HEADER_NAMES,
  TRANSFORMED_TRAINING_HEADER_NAMES,
} from './headers.ts'
import {
  TRANSFORM_FUNCTIONS_JS_TO_GS,
  transformTriesJSToGS,
} from './js-to-gs.ts'

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
    (acc, [key, value], index) => {
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
      acc.id = index
      return acc
    },
    {} as Record<string, string | number | boolean | Temporal.PlainDateTime>,
  )

  return sortKeys(removeObjectExtendedNullishValues(transformedAscent))
}

// Key = JS ascent object's key
// Header = Google Sheet's ascent's header
export function transformAscentFromJSToGS(
  ascent: Omit<Ascent, 'id'>,
): GSAscentRecord {
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

export function transformTrainingSessionFromGSToJS(
  rawTrainingSession: Record<string, string>,
): Record<string, string | number | boolean | Temporal.PlainDateTime> {
  const transformedTraining = Object.entries(rawTrainingSession).reduce(
    (acc, [key, value]) => {
      if (value === '') return acc

      const transformedKey =
        TRANSFORMED_TRAINING_HEADER_NAMES[key as GSTrainingKeys]

      const transform =
        TRANSFORM_FUNCTIONS_GS_TO_JS[
          transformedKey as keyof typeof TRANSFORM_FUNCTIONS_GS_TO_JS
        ] ?? TRANSFORM_FUNCTIONS_GS_TO_JS.default
      acc[transformedKey] = transform(value)

      return acc
    },
    {} as Record<string, string | number | boolean | Temporal.PlainDateTime>,
  )

  return sortKeys(removeObjectExtendedNullishValues(transformedTraining))
}

export function transformTrainingSessionFromJSToGS(
  trainingSession: TrainingSession,
): GSTrainingRecord {
  const filteredHeaders = TRAINING_HEADERS.filter(
    header => header !== 'Intensity' && header !== 'LOAD',
  )
  return filteredHeaders.reduce((accumulator, header) => {
    const key = TRANSFORMED_TRAINING_HEADER_NAMES[header]

    const valueAsString = trainingSession[key]?.toString() ?? ''

    const keyAs = key as keyof typeof TRANSFORM_FUNCTIONS_JS_TO_GS

    const transformer =
      keyAs in TRANSFORM_FUNCTIONS_JS_TO_GS
        ? TRANSFORM_FUNCTIONS_JS_TO_GS[keyAs]
        : String

    accumulator[header] = transformer(valueAsString)
    return accumulator
  }, {} as GSTrainingRecord)
}
