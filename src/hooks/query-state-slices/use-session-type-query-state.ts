import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { trainingSessionTypeSchema } from '~/domain/canonical/training-session'
import type { TrainingSession } from '~/schema/training'

export const useSessionTypeQueryState = (): UseQueryStateReturn<
  OrAll<NonNullable<TrainingSession['type']>>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<NonNullable<TrainingSession['type']>>>('type', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : trainingSessionTypeSchema.parse(value)),
  })
