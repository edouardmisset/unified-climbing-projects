import { type Percent, percentSchema } from '~/schema/generic'

export function calculateLoad(
  volume: Percent | undefined,
  intensity: Percent | undefined,
): Percent | undefined {
  if (volume === undefined || intensity === undefined) return
  return percentSchema.parse(Math.round((volume * intensity) / 100))
}
