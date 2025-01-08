'use client'

import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import { useQueryState } from 'nuqs'
import { createYearList } from '~/data/ascent-data'
import {
  ASCENT_STYLE,
  type Ascent,
  CLIMBING_DISCIPLINE,
  ascentStyleSchema,
  climbingDisciplineSchema,
} from '~/schema/ascent'
import { AscentSelect } from '../ascent-select/ascent-select.tsx'
import { ALL_VALUE } from '../dashboard/constants.ts'
import type { OrAll } from '../dashboard/types.ts'
import styles from './ascent-filter-bar.module.css'
import { createChangeHandler } from './helpers.ts'

export default function AscentsFilterBar({
  allAscents,
}: { allAscents: Ascent[] }) {
  const yearList = createYearList(allAscents)

  const KNOWN_CRAG_LIST = [
    ...new Set(allAscents.map(({ crag }) => crag)),
  ].sort()

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
  const [selectedCrag, setSelectedCrag] = useQueryState<OrAll<Ascent['crag']>>(
    'crag',
    {
      defaultValue: ALL_VALUE,
      parse: value => (value === ALL_VALUE ? ALL_VALUE : value),
    },
  )

  const handleYearChange = createChangeHandler(setSelectedYear)
  const handleStyleChange = createChangeHandler(setSelectedStyle)
  const handleDisciplineChange = createChangeHandler(setSelectedDiscipline)
  const handleCragChange = createChangeHandler(setSelectedCrag)

  return (
    <div className={styles.container}>
      <AscentSelect
        handleChange={handleDisciplineChange}
        name="discipline"
        options={CLIMBING_DISCIPLINE}
        selectedOption={selectedDiscipline}
        title="Climbing Discipline"
      />
      <AscentSelect
        handleChange={handleStyleChange}
        name="style"
        options={ASCENT_STYLE}
        selectedOption={selectedStyle}
        title="Ascent Style"
      />
      <AscentSelect
        handleChange={handleYearChange}
        name="year"
        options={yearList}
        selectedOption={selectedYear}
      />
      <AscentSelect
        handleChange={handleCragChange}
        name="crag"
        options={KNOWN_CRAG_LIST}
        selectedOption={selectedCrag}
      />
    </div>
  )
}
