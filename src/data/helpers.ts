import { getDaysInYear } from '~/helpers/date'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'

export function createEmptyYearlyCollections<T = Ascent | TrainingSession>(
  listOfYears: number[],
): Record<number, T[][]> {
  return Object.fromEntries(
    listOfYears.map(year => [
      year,
      Array.from({ length: getDaysInYear(year) }).map(() => [] as T[]),
    ]),
  )
}
