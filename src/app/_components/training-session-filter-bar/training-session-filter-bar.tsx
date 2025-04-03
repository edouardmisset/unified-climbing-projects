'use client'

import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import { useQueryState } from 'nuqs'
import { createYearList } from '~/data/helpers.ts'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import {
  LOAD_CATEGORIES,
  type LoadCategory,
  SESSION_TYPES,
  type TrainingSession,
  trainingSessionSchema,
} from '~/schema/training.ts'
import styles from '../ascents-filter-bar/ascent-filter-bar.module.css'
import { createChangeHandler } from '../ascents-filter-bar/helpers.ts'
import { CustomSelect } from '../custom-select/custom-select.tsx'
import { ALL_VALUE } from '../dashboard/constants.ts'
import type { OrAll } from '../dashboard/types.ts'

export function TrainingSessionFilterBar({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}): React.JSX.Element {
  const yearList = createYearList(trainingSessions, { descending: true })

  const locationList = (
    [
      ...new Set(
        trainingSessions
          .filter(({ gymCrag }) => gymCrag !== undefined)
          .map(({ gymCrag }) => gymCrag),
      ),
    ] as string[]
  ).sort(compareStringsAscending)

  const [selectedYear, setSelectedYear] = useQueryState<OrAll<string>>('year', {
    defaultValue:
      yearList[0] !== undefined ? yearList[0].toString() : ALL_VALUE,
    parse: value =>
      value === ALL_VALUE
        ? ALL_VALUE
        : validNumberWithFallback(value, ALL_VALUE).toString(),
  })

  const [selectedSessionType, setSelectedSessionType] = useQueryState<
    OrAll<NonNullable<TrainingSession['sessionType']>>
  >('sessionType', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE
        ? ALL_VALUE
        : trainingSessionSchema
            .required({ sessionType: true })
            .shape.sessionType.parse(value),
  })

  const [selectedLoad, setSelectedLoad] = useQueryState<OrAll<LoadCategory>>(
    'load',
    {
      defaultValue: ALL_VALUE,
      parse: value =>
        LOAD_CATEGORIES.includes(value) ? (value as LoadCategory) : ALL_VALUE,
    },
  )

  const [selectedLocation, setSelectedLocation] = useQueryState<
    OrAll<NonNullable<TrainingSession['gymCrag']>>
  >('location', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE
        ? ALL_VALUE
        : trainingSessionSchema
            .required({ gymCrag: true })
            .shape.gymCrag.parse(value),
  })

  const handleYearChange = createChangeHandler(setSelectedYear)
  const handleSessionTypeChange = createChangeHandler(setSelectedSessionType)
  const handleLoadLevelChange = createChangeHandler(setSelectedLoad)
  const handleLocationChange = createChangeHandler(setSelectedLocation)

  return (
    <search className={styles.container}>
      <div className={styles.backdrop} />
      <div className={styles.backdropEdge} />
      <div className={styles.filters}>
        <CustomSelect
          handleChange={handleSessionTypeChange}
          name="Session Type"
          options={SESSION_TYPES}
          selectedOption={selectedSessionType}
          title="Session Type"
        />
        <CustomSelect
          handleChange={handleLoadLevelChange}
          name="load"
          options={LOAD_CATEGORIES}
          selectedOption={selectedLoad}
          title="Load"
        />
        <CustomSelect
          handleChange={handleYearChange}
          name="year"
          options={yearList}
          selectedOption={selectedYear}
          title="Year"
        />
        {locationList.length > 0 && (
          <CustomSelect
            handleChange={handleLocationChange}
            name="location"
            options={locationList}
            selectedOption={selectedLocation}
            title="Location"
          />
        )}
      </div>
    </search>
  )
}
