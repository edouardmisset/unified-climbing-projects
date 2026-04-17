import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { type Ascent, ascentSchema } from '~/schema/ascent'

export const useRouteQueryState = (): UseQueryStateReturn<Ascent['routeName'], ''> =>
  useQueryState<Ascent['routeName']>('route', {
    defaultValue: '',
    parse: value => (value === '' ? '' : ascentSchema.unwrap().shape.routeName.parse(value)),
  })
