import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/shared/components/dashboard/constants'
import type { OrAll } from '~/shared/components/dashboard/types'
import { type TrainingSession, trainingSessionSchema } from '~/training/schema'

const requiredGymCrag = trainingSessionSchema.required({ gymCrag: true }).shape.gymCrag

export const useLocationQueryState = (): UseQueryStateReturn<
  OrAll<NonNullable<TrainingSession['gymCrag']>>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<NonNullable<TrainingSession['gymCrag']>>>('location', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : requiredGymCrag.parse(value)),
  })
