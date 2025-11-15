import type { Ascent } from '~/schema/ascent'

export type ClimbingDisciplineMetric = {
  id: Ascent['discipline']
  label: Ascent['discipline']
  value: number
  color: string
}
