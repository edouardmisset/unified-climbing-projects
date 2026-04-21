import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/shared/components/dashboard/constants'
import type { OrAll } from '~/shared/components/dashboard/types'
import { type TrainingSession, trainingSessionSchema } from '~/training/schema'

export const useSessionTypeQueryState = (): UseQueryStateReturn<
  OrAll<NonNullable<TrainingSession['sessionType']>>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<NonNullable<TrainingSession['sessionType']>>>('sessionType', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE
        ? ALL_VALUE
        : trainingSessionSchema.required({ sessionType: true }).shape.sessionType.parse(value),
  })
