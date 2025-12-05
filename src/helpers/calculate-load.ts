export function calculateLoad(
  volume: number | undefined,
  intensity: number | undefined,
): number | undefined {
  if (volume === undefined || intensity === undefined) return
  return Math.round((volume * intensity) / 100)
}
