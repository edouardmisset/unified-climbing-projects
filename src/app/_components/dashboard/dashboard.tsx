'use client'

import { useQueryState } from 'nuqs'
import AscentsFilterBar from '~/app/_components/ascents-filter-bar/ascents-filter-bar'
import { AscentPyramid } from '~/app/_components/ascents-pyramid/ascent-pyramid'
import { filterAscents } from '~/helpers/filter-ascents.ts'
import type { Ascent } from '~/schema/ascent'
import { api } from '~/trpc/react'
import { ALL_VARIABLE } from './constants.ts'

export function Dashboard() {
  const [selectedYear] = useQueryState('year', {
    defaultValue: ALL_VARIABLE,
  })
  const [selectedDiscipline] = useQueryState('discipline', {
    defaultValue: ALL_VARIABLE,
  })
  const [selectedStyle] = useQueryState('style', {
    defaultValue: ALL_VARIABLE,
  })

  const [allAscents] = api.ascents.getAllAscents.useSuspenseQuery()

  if (!allAscents) return <div>Loading...</div>

  const filteredAscents = filterAscents(allAscents, {
    year: selectedYear === ALL_VARIABLE ? undefined : Number(selectedYear),
    climbingDiscipline:
      selectedDiscipline === ALL_VARIABLE
        ? undefined
        : (selectedDiscipline as Ascent['climbingDiscipline']),
    style:
      selectedStyle === ALL_VARIABLE
        ? undefined
        : (selectedStyle as Ascent['style']),
  })

  return (
    <>
      <AscentsFilterBar ascents={allAscents} />
      <AscentPyramid ascents={filteredAscents} />
    </>
  )
}
