import { disjunctiveListFormatter } from '~/helpers/list-formatter'
import { AVAILABLE_CLIMBING_DISCIPLINE } from '~/schema/ascent'
import {
  ANATOMICAL_REGIONS,
  ENERGY_SYSTEMS,
  SESSION_TYPES,
} from '~/schema/training'

export const climbingDisciplineFormattedList = disjunctiveListFormatter(
  AVAILABLE_CLIMBING_DISCIPLINE,
)
export const anatomicalRegionFormattedList =
  disjunctiveListFormatter(ANATOMICAL_REGIONS)
export const energySystemFormattedList =
  disjunctiveListFormatter(ENERGY_SYSTEMS)
export const sessionTypeFormattedList = disjunctiveListFormatter(SESSION_TYPES)
