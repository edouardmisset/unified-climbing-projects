import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import {
  type LoadCategory,
  loadCategorySchema,
  type TrainingSession,
  trainingSessionSchema,
} from '~/schema/training'

export const useTrainingSessionsQueryState =
  (): UseTrainingSessionsQueryStateReturn => {
    const [selectedYear, setYear] = useQueryState<OrAll<string>>('year', {
      defaultValue: ALL_VALUE,
      parse: value => {
        if (value === ALL_VALUE) return ALL_VALUE
        if (isValidNumber(Number(value))) return value
        return null
      },
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
        value === ALL_VALUE ? ALL_VALUE : loadCategorySchema.parse(value),
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
      selectedLoad,
      selectedLocation,
      selectedSessionType,
      selectedYear,
      setLoad,
      setLocation,
      setSessionType,
      setYear,
    }
  }

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
