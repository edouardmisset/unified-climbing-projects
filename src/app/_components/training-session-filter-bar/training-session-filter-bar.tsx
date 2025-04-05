'use client'

import { createYearList } from '~/data/helpers.ts'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useTrainingSessionsQueryState } from '~/hooks/use-training-sessions-query-state.ts'
import {
  LOAD_CATEGORIES,
  SESSION_TYPES,
  type TrainingSession,
} from '~/schema/training.ts'
import styles from '../ascents-filter-bar/ascent-filter-bar.module.css'
import { createChangeHandler } from '../ascents-filter-bar/helpers.ts'
import { CustomSelect } from '../custom-select/custom-select.tsx'

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

  const {
    selectedYear,
    selectedSessionType,
    selectedLoad,
    selectedLocation,
    setLoad,
    setLocation,
    setSessionType,
    setYear,
  } = useTrainingSessionsQueryState()

  const handleYearChange = createChangeHandler(setYear)
  const handleSessionTypeChange = createChangeHandler(setSessionType)
  const handleLoadLevelChange = createChangeHandler(setLoad)
  const handleLocationChange = createChangeHandler(setLocation)

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
        {yearList.length > 0 && (
          <CustomSelect
            handleChange={handleYearChange}
            name="year"
            options={yearList}
            selectedOption={selectedYear}
            title="Year"
          />
        )}
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
