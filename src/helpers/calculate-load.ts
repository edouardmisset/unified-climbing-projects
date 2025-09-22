export function calculateLoad(
  volume: number | undefined,
  intensity: number | undefined,
): number | undefined {
  if (volume === undefined || intensity === undefined) return undefined
  return Math.round((volume * intensity) / 100)
}
