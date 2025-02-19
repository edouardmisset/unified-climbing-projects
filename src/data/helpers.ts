import { getDaysInYear } from '~/helpers/date'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'

type YearlyDaysCollection<T> = {
  [year: number]: T[][]
}

export function createEmptyYearlyDaysCollection<T = Ascent | TrainingSession>(
  listOfYears: number[],
): YearlyDaysCollection<T> {
  const yearlyCollections: YearlyDaysCollection<T> = {}

  for (const year of listOfYears) {
    yearlyCollections[year] = Array.from({ length: getDaysInYear(year) }).map(
      () => [] as T[],
    )
  }

  return yearlyCollections
}
