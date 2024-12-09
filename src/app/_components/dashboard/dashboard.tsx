'use client'

import { useQueryState } from 'nuqs'
import AscentsFilterBar from '~/app/_components/ascents-filter-bar/ascents-filter-bar'
import { AscentPyramid } from '~/app/_components/ascents-pyramid/ascent-pyramid'
import type { Ascent } from '~/schema/ascent'
import { api } from '~/trpc/react'

const allVariable = 'all'

export function Dashboard() {
  const [selectedYear] = useQueryState('year', {
    defaultValue: allVariable,
  })
  const [selectedDiscipline] = useQueryState('discipline', {
    defaultValue: allVariable,
  })
  const [selectedStyle] = useQueryState('style', {
    defaultValue: allVariable,
  })

  const [data] = api.grades.getFrequency.useSuspenseQuery({
    year: selectedYear === allVariable ? undefined : Number(selectedYear),
    'climbing-discipline':
      selectedDiscipline === allVariable
        ? undefined
        : (selectedDiscipline as Ascent['climbingDiscipline']),
    style:
      selectedStyle === allVariable
        ? undefined
        : (selectedStyle as Ascent['style']),
  })
  const [allAscents] = api.ascents.getAllAscents.useSuspenseQuery()

  if (!(data && allAscents)) return <div>Loading...</div>

  const gradeFrequency = data.map(([key, value]) => ({
    grade: key,
    number: value,
  }))

  return (
    <>
      <AscentsFilterBar ascents={allAscents} />
      <AscentPyramid gradeFrequency={gradeFrequency} />
    </>
  )
}
