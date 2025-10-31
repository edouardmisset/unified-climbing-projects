import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { type TrainingSession, trainingSessionSchema } from '~/schema/training'

export const useSessionTypeQueryState = (): UseQueryStateReturn<
  OrAll<NonNullable<TrainingSession['type']>>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<NonNullable<TrainingSession['type']>>>('sessionType', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE
        ? ALL_VALUE
        : trainingSessionSchema
            .required({ type: true })
            .shape.type.parse(value),
  })
