import { disjunctiveListFormatter } from '~/helpers/list-formatter'
import { AVAILABLE_CLIMBING_DISCIPLINE } from '~/schema/ascent'
import {
  ANATOMICAL_REGIONS,
  ENERGY_SYSTEMS,
  fromAnatomicalRegionToLabel,
  fromEnergySystemToLabel,
  fromSessionTypeToLabel,
  SESSION_TYPES,
} from '~/schema/training'

function getFormattedList<T extends string>(
  list: readonly T[],
  transform: (item: T) => string,
) {
  return disjunctiveListFormatter(list.map(transform))
}

export const climbingDisciplineFormattedList = disjunctiveListFormatter(
  AVAILABLE_CLIMBING_DISCIPLINE,
)
export const anatomicalRegionFormattedList = getFormattedList(
  ANATOMICAL_REGIONS,
  fromAnatomicalRegionToLabel,
)
export const energySystemFormattedList = getFormattedList(
  ENERGY_SYSTEMS,
  fromEnergySystemToLabel,
)
export const sessionTypeFormattedList = getFormattedList(
  SESSION_TYPES,
  fromSessionTypeToLabel,
)
