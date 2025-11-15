import type { LoadCategory } from '~/schema/training'

/** Calculate the load of a training session
 * @param volume - volume of the training session [0 - 100]
 * @param intensity - intensity of the training session [0 - 100]
 * @returns load of the training session or undefined if volume or intensity is
 * undefined
 */
export function calculateLoad(
  volume: number | undefined,
  intensity: number | undefined,
): number | undefined {
  if (volume === undefined && intensity === undefined) return undefined
  return Math.round(((volume ?? 1) * (intensity ?? 1)) / 100)
}

/** Check if a load value falls within a specified load category
 * @param load - load value to check
 * @param loadCategory - load category to check against
 * @returns true if the load value falls within the specified load category,
 * false otherwise
 */
export function isLoadInLoadCategory(
  load: number | undefined,
  loadCategory: LoadCategory,
): boolean {
  if (load === undefined) return false

  if (loadCategory === 'Low') {
    return load < 30
  }
  if (loadCategory === 'Medium') {
    return 30 <= load && load < 70
  }
  if (loadCategory === 'High') {
    return 70 <= load
  }
  return false
}
