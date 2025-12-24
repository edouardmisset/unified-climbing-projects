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
  if (volume === undefined || intensity === undefined) return
  return Math.round((volume * intensity) / 100)
}
