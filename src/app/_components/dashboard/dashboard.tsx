'use client'

import { useQueryState } from 'nuqs'
import { api } from '~/trpc/react'
import AscentsFilterBar from '../ascents-filter-bar/ascents-filter-bar'
import { AscentPyramid } from '../ascents-pyramid/ascent-pyramid'

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
