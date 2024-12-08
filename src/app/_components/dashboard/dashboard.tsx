'use client'

import { useQueryState } from 'nuqs'
import AscentsFilterBar from '~/app/_components/ascents-filter-bar/ascents-filter-bar'
import { AscentPyramid } from '~/app/_components/ascents-pyramid/ascent-pyramid'
import { api } from '~/trpc/react'

export function Dashboard() {
  const [selectedYear] = useQueryState('year', {
    defaultValue: 'all',
  })

  const [data] = api.grades.getFrequency.useSuspenseQuery({
    year: selectedYear === 'all' ? undefined : Number(selectedYear),
  })
  const [allAscents] = api.ascents.getAllAscents.useSuspenseQuery()

  if (!(data && allAscents)) return <div>Loading...</div>

  const grades = data.map(([key, value]) => ({
    grade: key,
    number: value,
  }))

  if (grades === undefined) return <div>No data</div>

  return (
    <>
      <AscentsFilterBar ascents={allAscents} />
      <AscentPyramid grades={grades} />
    </>
  )
}
