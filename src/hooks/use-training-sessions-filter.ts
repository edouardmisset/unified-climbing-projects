import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { createYearList } from '~/data/helpers'
import { filterTrainingSessions } from '~/helpers/filter-training'
import {
  LOAD_CATEGORIES,
  type LoadCategory,
  type TrainingSession,
  trainingSessionSchema,
} from '~/schema/training'

export function useTrainingSessionsFilter(
  trainingSessions: TrainingSession[],
): TrainingSession[] {
  const yearList = createYearList(trainingSessions, { descending: true })

  const [selectedYear] = useQueryState<OrAll<string>>('year', {
    defaultValue:
      yearList[0] !== undefined ? yearList[0].toString() : ALL_VALUE,
    parse: value =>
      value === ALL_VALUE
        ? ALL_VALUE
        : validNumberWithFallback(value, ALL_VALUE).toString(),
  })

  const [selectedSessionType] = useQueryState<
    OrAll<NonNullable<TrainingSession['sessionType']>>
  >('sessionType', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE
        ? ALL_VALUE
        : trainingSessionSchema
            .required({ sessionType: true })
            .shape.sessionType.parse(value),
  })

  const [selectedLoad] = useQueryState<OrAll<LoadCategory>>('load', {
    defaultValue: ALL_VALUE,
    parse: value =>
      LOAD_CATEGORIES.includes(value) ? (value as LoadCategory) : ALL_VALUE,
  })

  const [selectedLocation] = useQueryState<
    OrAll<NonNullable<TrainingSession['gymCrag']>>
  >('location', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE
        ? ALL_VALUE
        : trainingSessionSchema
            .required({ gymCrag: true })
            .shape.gymCrag.parse(value),
  })

  const filteredTrainingSessions = useMemo(
    () =>
      filterTrainingSessions(trainingSessions, {
        year: selectedYear === ALL_VALUE ? undefined : Number(selectedYear),
        sessionType:
          selectedSessionType === ALL_VALUE ? undefined : selectedSessionType,
        load: selectedLoad === ALL_VALUE ? undefined : selectedLoad,
        gymCrag: selectedLocation === ALL_VALUE ? undefined : selectedLocation,
      }),
    [
      trainingSessions,
      selectedLocation,
      selectedLoad,
      selectedSessionType,
      selectedYear,
    ],
  )

  return filteredTrainingSessions
}
