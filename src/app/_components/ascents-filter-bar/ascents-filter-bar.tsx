'use client'
import { useQueryState } from 'nuqs'
import { createYearList } from '~/data/ascent-data'
import {
  ASCENT_STYLE,
  type Ascent,
  CLIMBING_DISCIPLINE,
  HOLDS,
  PROFILES,
} from '~/schema/ascent'
import { AscentSelect } from '../ascent-select/ascent-select.tsx'
import { ALL_VALUE } from '../dashboard/constants.ts'
import styles from './ascent-filter-bar.module.css'
import { createChangeHandler } from './helpers.ts'

export default function AscentsFilterBar({
  allAscents,
}: { allAscents: Ascent[] }) {
  const yearList = createYearList(allAscents)
  const heightList = [
    ...new Set(allAscents.map(({ height }) => height).filter(Boolean)),
  ].sort()
  const tryList = [...new Set(allAscents.map(({ tries }) => tries))].sort()
  const ratingList = [
    ...new Set(allAscents.map(({ rating }) => rating).filter(Boolean)),
  ].sort((a, b) => b - a)

  const KNOWN_CRAG_LIST = [
    ...new Set(allAscents.map(({ crag }) => crag)),
  ].sort()

  const [selectedYear, setSelectedYear] = useQueryState('year', {
    defaultValue: ALL_VALUE,
  })
  const [selectedStyle, setSelectedStyle] = useQueryState('style', {
    defaultValue: ALL_VALUE,
  })
  const [selectedDiscipline, setSelectedDiscipline] = useQueryState(
    'discipline',
    { defaultValue: ALL_VALUE },
  )
  const [selectedCrag, setSelectedCrag] = useQueryState('crag', {
    defaultValue: ALL_VALUE,
  })
  const [selectedProfile, setSelectedProfile] = useQueryState('profile', {
    defaultValue: ALL_VALUE,
  })
  const [selectedHolds, setSelectHolds] = useQueryState('holds', {
    defaultValue: ALL_VALUE,
  })
  const [selectedHeight, setSelectedHeight] = useQueryState('height', {
    defaultValue: ALL_VALUE,
  })
  const [selectedTries, setSelectedTries] = useQueryState('tries', {
    defaultValue: ALL_VALUE,
  })
  const [selectedRating, setSelectedRating] = useQueryState('rating', {
    defaultValue: ALL_VALUE,
  })

  const handleYearChange = createChangeHandler(setSelectedYear)
  const handleStyleChange = createChangeHandler(setSelectedStyle)
  const handleDisciplineChange = createChangeHandler(setSelectedDiscipline)
  const handleCragChange = createChangeHandler(setSelectedCrag)
  const handleProfileChange = createChangeHandler(setSelectedProfile)
  const handleHoldsChange = createChangeHandler(setSelectHolds)
  const handleHeightChange = createChangeHandler(setSelectedHeight)
  const handleTriesChange = createChangeHandler(setSelectedTries)
  const handleRatingChange = createChangeHandler(setSelectedRating)

  return (
    <div className={styles.container}>
      <AscentSelect
        handleChange={handleYearChange}
        name="year"
        options={yearList}
        selectedOption={selectedYear}
      />
      <AscentSelect
        handleChange={handleStyleChange}
        name="style"
        options={ASCENT_STYLE}
        selectedOption={selectedStyle}
        title="Ascent Style"
      />
      <AscentSelect
        handleChange={handleDisciplineChange}
        name="discipline"
        options={CLIMBING_DISCIPLINE}
        selectedOption={selectedDiscipline}
        title="Climbing Discipline"
      />
      <AscentSelect
        handleChange={handleCragChange}
        name="crag"
        options={KNOWN_CRAG_LIST}
        selectedOption={selectedCrag}
      />
      <AscentSelect
        handleChange={handleProfileChange}
        name="profile"
        options={PROFILES}
        selectedOption={selectedProfile}
      />
      <AscentSelect
        handleChange={handleHoldsChange}
        name="holds"
        options={HOLDS}
        selectedOption={selectedHolds}
      />
      <AscentSelect
        handleChange={handleHeightChange}
        name="height"
        options={heightList}
        selectedOption={selectedHeight}
        title="Height of the route in meters"
      />
      <AscentSelect
        handleChange={handleTriesChange}
        name="tries"
        options={tryList}
        selectedOption={selectedTries}
      />
      <AscentSelect
        handleChange={handleRatingChange}
        name="rating"
        options={ratingList}
        selectedOption={selectedRating}
      />
    </div>
  )
}
