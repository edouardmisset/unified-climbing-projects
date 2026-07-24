import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { trainingSessionDomainSchema } from '~/domain/canonical/training-session'
import type { TrainingSession } from '~/schema/training'

const requiredLocation = trainingSessionDomainSchema.shape.location.unwrap()

export const useLocationQueryState = (): UseQueryStateReturn<
  OrAll<NonNullable<TrainingSession['location']>>,
  typeof ALL_VALUE
> =>
  useQueryState<OrAll<NonNullable<TrainingSession['location']>>>('location', {
    defaultValue: ALL_VALUE,
    parse: (value) => (value === ALL_VALUE ? ALL_VALUE : requiredLocation.parse(value)),
  })
