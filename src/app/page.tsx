import { api } from '~/trpc/server'
import GridLayout from './_components/grid-layout/grid-layout'

async function fetchClimbingData() {
  const [ascents, grades, gradeAverage] = await Promise.all([
    api.ascents.getAllAscents({
      descending: true,
    }),
    api.grades.getAllGrades(),
    api.grades.getAverage(),
  ])
  return {
    ascents,
    grades,
    gradeAverage,
  }
}

export default async function Home() {
  const { ascents, grades, gradeAverage } = await fetchClimbingData()

  return <GridLayout title="All time">Hi</GridLayout>
}
