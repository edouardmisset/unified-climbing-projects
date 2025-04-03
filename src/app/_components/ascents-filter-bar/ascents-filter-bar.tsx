'use client'

import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import { useQueryState } from 'nuqs'
import { createYearList } from '~/data/helpers.ts'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import {
  ASCENT_STYLE,
  AVAILABLE_CLIMBING_DISCIPLINE,
  type Ascent,
  ascentSchema,
  ascentStyleSchema,
  climbingDisciplineSchema,
} from '~/schema/ascent'
import { CustomSelect } from '../custom-select/custom-select.tsx'
import { ALL_VALUE } from '../dashboard/constants.ts'
import type { OrAll } from '../dashboard/types.ts'
import styles from './ascent-filter-bar.module.css'
import { createChangeHandler } from './helpers.ts'

export default function AscentsFilterBar({
  allAscents,
}: { allAscents: Ascent[] }) {
  const yearList = createYearList(allAscents, { descending: true })

  const cragList = [...new Set(allAscents.map(({ crag }) => crag))].sort(
    (a, b) => compareStringsAscending(a, b),
  )

  const [selectedCrag, setSelectedCrag] = useQueryState<OrAll<string>>('crag', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : ascentSchema.shape.crag.parse(value),
  })
  const [selectedYear, setSelectedYear] = useQueryState<OrAll<string>>('year', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE
        ? ALL_VALUE
        : validNumberWithFallback(value, ALL_VALUE).toString(),
  })
  const [selectedDiscipline, setSelectedDiscipline] = useQueryState<
    OrAll<Ascent['climbingDiscipline']>
  >('discipline', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : climbingDisciplineSchema.parse(value),
  })
  const [selectedStyle, setSelectedStyle] = useQueryState<
    OrAll<Ascent['style']>
  >('style', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : ascentStyleSchema.parse(value),
  })

  const handleYearChange = createChangeHandler(setSelectedYear)
  const handleStyleChange = createChangeHandler(setSelectedStyle)
  const handleDisciplineChange = createChangeHandler(setSelectedDiscipline)
  const handleCragChange = createChangeHandler(setSelectedCrag)

  return (
    <search className={styles.container}>
      <div className={styles.backdrop} />
      <div className={styles.backdropEdge} />
      <div className={styles.filters}>
        <CustomSelect
          handleChange={handleDisciplineChange}
          name="discipline"
          options={AVAILABLE_CLIMBING_DISCIPLINE}
          selectedOption={selectedDiscipline}
          title="Climbing Discipline"
        />
        <CustomSelect
          handleChange={handleStyleChange}
          name="style"
          options={ASCENT_STYLE}
          selectedOption={selectedStyle}
          title="Ascent Style"
        />
        <CustomSelect
          handleChange={handleYearChange}
          name="year"
          options={yearList}
          selectedOption={selectedYear}
        />
        <CustomSelect
          handleChange={handleCragChange}
          name="crag"
          options={cragList}
          selectedOption={selectedCrag}
        />
      </div>
    </search>
  )
}
