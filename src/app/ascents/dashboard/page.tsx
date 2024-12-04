'use server'

import { AscentPyramid } from '~/app/_components/ascents-pyramid/ascent-pyramid'
import { api } from '~/trpc/server'

export default async function Page() {
  const data = await api.grades.getFrequency()

  const grades = data.map(([key, value]) => ({
    grade: key,
    number: value,
  }))

  if (grades === undefined) return <div>No data</div>

  return (
    <div>
      <h1>Dashboard</h1>
      <AscentPyramid grades={grades} />
    </div>
  )
}
