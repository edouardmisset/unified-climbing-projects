import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { type Ascent, ascentSchema } from '~/schema/ascent'

export const useRouteQueryState = (): UseQueryStateReturn<Ascent['name'], ''> =>
  useQueryState<Ascent['name']>('Sport', {
    defaultValue: '',
    parse: value => (value === '' ? '' : ascentSchema.shape.name.parse(value)),
  })
