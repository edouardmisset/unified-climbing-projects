import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import { useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import {
  LOAD_CATEGORIES,
  type LoadCategory,
  type TrainingSession,
  trainingSessionSchema,
} from '~/schema/training'

type UseTrainingSessionsQueryStateReturn = {
  selectedYear: OrAll<string>
  selectedSessionType: OrAll<NonNullable<TrainingSession['sessionType']>>
  selectedLoad: OrAll<LoadCategory>
  selectedLocation: OrAll<NonNullable<TrainingSession['gymCrag']>>
  setYear: (year: OrAll<string>) => void
  setSessionType: (
    sessionType: OrAll<NonNullable<TrainingSession['sessionType']>>,
  ) => void
  setLoad: (load: OrAll<LoadCategory>) => void
  setLocation: (
    location: OrAll<NonNullable<TrainingSession['gymCrag']>>,
  ) => void
}

export const useTrainingSessionsQueryState =
  (): UseTrainingSessionsQueryStateReturn => {
    const [selectedYear, setYear] = useQueryState<OrAll<string>>('year', {
      defaultValue: ALL_VALUE,
      parse: value =>
        value === ALL_VALUE
          ? ALL_VALUE
          : validNumberWithFallback(value, ALL_VALUE).toString(),
    })

    const [selectedSessionType, setSessionType] = useQueryState<
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

    const [selectedLoad, setLoad] = useQueryState<OrAll<LoadCategory>>('load', {
      defaultValue: ALL_VALUE,
      parse: value =>
        LOAD_CATEGORIES.includes(value) ? (value as LoadCategory) : ALL_VALUE,
    })

    const [selectedLocation, setLocation] = useQueryState<
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

    return {
      selectedYear,
      selectedSessionType,
      selectedLoad,
      selectedLocation,
      setYear,
      setSessionType,
      setLoad,
      setLocation,
    }
  }
