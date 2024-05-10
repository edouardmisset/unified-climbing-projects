import type { TrainingSession } from '~/types/training'

export const otherSessionTypeColor = 'lightGrey'
export const taperedColor = 'violet'
export const skillsColor = 'lightBlue'
export const strengthColor = 'indianRed'
export const enduranceColor = 'lightSalmon'
export const outdoorColor = 'lightGreen'

const SESSION_TYPE_TO_COLOR: Record<
  Required<TrainingSession>['sessionType'],
  string
> = {
  Ex: outdoorColor,

  En: enduranceColor,
  PE: enduranceColor,
  SE: enduranceColor,

  MS: strengthColor,
  CS: strengthColor,
  Po: strengthColor,

  Sk: skillsColor,
  St: skillsColor,

  Ta: taperedColor,

  Sg: otherSessionTypeColor,
  FB: otherSessionTypeColor,
  Co: otherSessionTypeColor,
  Ro: otherSessionTypeColor,
}

export const convertSessionTypeToColor = (
  sessionType: Required<TrainingSession>['sessionType'],
): string => SESSION_TYPE_TO_COLOR[sessionType] ?? 'black'
