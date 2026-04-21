import AscentForm from './_components/ascent-form.tsx'
import {
  getAllAreas,
  getAllCrags,
  getLatestAscent,
  getMinMaxGrades,
} from '~/ascents/service-helpers'

export async function AscentFormWrapper() {
  const [latestAscent, [minGrade, maxGrade], allCrags, allAreas] = await Promise.all([
    getLatestAscent(),
    getMinMaxGrades(),
    getAllCrags(),
    getAllAreas(),
  ])

  return (
    <AscentForm
      areas={allAreas}
      crags={allCrags}
      latestAscent={latestAscent}
      maxGrade={maxGrade}
      minGrade={minGrade}
    />
  )
}
