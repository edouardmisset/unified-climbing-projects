export const REDPOINT_STYLE = 'Redpoint' as const

export function ascentRequiresRedpoint(tries: number | string): boolean {
  return Number(tries) > 1
}

export function isAscentStyleValidForTries(style: string, tries: number | string): boolean {
  return !ascentRequiresRedpoint(tries) || style === REDPOINT_STYLE
}
