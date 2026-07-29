import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ascentDomainSchema } from '~/domain/canonical/ascent'
import type { Ascent } from '~/schema/ascent'

export const useRouteQueryState = (): UseQueryStateReturn<Ascent['name'], ''> =>
  useQueryState<Ascent['name']>('route', {
    defaultValue: '',
    parse: value => (value === '' ? '' : ascentDomainSchema.shape.name.parse(value)),
  })
