import AscentForm from './_components/ascent-form.tsx'
import {
  getAllAreas,
  getAllCrags,
  getLatestAscent,
  getMinMaxGrades,
} from '~/services/ascent-helpers'

export async function AscentFormWrapper() {
  const [latestAscent, [minGrade = '7a', maxGrade = '8a'], allCrags, allAreas] = await Promise.all([
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
