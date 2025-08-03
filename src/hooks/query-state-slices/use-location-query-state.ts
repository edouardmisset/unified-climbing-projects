import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { type TrainingSession, trainingSessionSchema } from '~/schema/training'

const requiredGymCrag = trainingSessionSchema.required({ gymCrag: true }).shape
  .gymCrag

export const useLocationQueryState = (): UseQueryStateReturn<
  OrAll<NonNullable<TrainingSession['gymCrag']>>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<NonNullable<TrainingSession['gymCrag']>>>('location', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : requiredGymCrag.parse(value),
  })
