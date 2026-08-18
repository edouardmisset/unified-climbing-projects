export const LOG_SCOPES = ['ascents', 'training', 'both'] as const

export type LogScope = (typeof LOG_SCOPES)[number]

export function includesAscents(scope: LogScope): boolean {
  return scope === 'ascents' || scope === 'both'
}

export function includesTraining(scope: LogScope): boolean {
  return scope === 'training' || scope === 'both'
}
