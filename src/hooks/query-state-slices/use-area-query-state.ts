import { type UseQueryStateReturn, useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { ascentDomainSchema } from '~/domain/ascent'

function parseArea(value: string): OrAll<string> | null {
  if (value === ALL_VALUE) return ALL_VALUE
  if (value.trim() === '') return null

  return parseValidArea(value)
}

function parseValidArea(value: string): string | null {
  const result = ascentDomainSchema.shape.area.safeParse(value)
  if (!result.success) return null
  return result.data ?? null
}

export const useAreaQueryState = (): UseQueryStateReturn<OrAll<string>, typeof ALL_VALUE> =>
  useQueryState<OrAll<string>>('area', {
    defaultValue: ALL_VALUE,
    parse: parseArea,
  })
