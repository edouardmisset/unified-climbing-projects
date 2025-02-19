import { getDaysInYear } from '~/helpers/date'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import type { StringDateTime } from '~/types/generic'

type YearlyDaysCollection<T> = {
  [year: number]: T[][]
}

export function createEmptyYearlyDaysCollection<T = Ascent | TrainingSession>(
  years: number[],
): YearlyDaysCollection<T> {
  const yearlyCollections: YearlyDaysCollection<T> = {}

  for (const year of years) {
    yearlyCollections[year] = Array.from({ length: getDaysInYear(year) }).map(
      () => [] as T[],
    )
  }

  return yearlyCollections
}

export function createYearList<T extends StringDateTime>(
  data: T[],
  options?: { descending?: boolean },
) {
  const { descending = true } = options ?? {}
  return [
    ...new Set(data.map(({ date }) => new Date(date).getFullYear())),
  ].sort((a, b) => (a - b) * (descending ? -1 : 1))
}

/** Initially, the array of training sessions is empty */
export const createYearlyDataDaysCollection = <
  T extends StringDateTime = TrainingSession | Ascent,
>(
  data: T[],
): { [year: number]: T[][] } =>
  createEmptyYearlyDaysCollection<T>(createYearList(data))
