import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { type Ascent, ascentSchema, SPORT } from '~/schema/ascent'

export const useRouteQueryState = (): UseQueryStateReturn<Ascent['name'], ''> =>
  useQueryState<Ascent['name']>(SPORT, {
    defaultValue: '',
    parse: value => (value === '' ? '' : ascentSchema.shape.name.parse(value)),
  })
