import AscentForm from './_components/ascent-form.tsx'
import {
  getAllAreas,
  getAllCrags,
  getLatestAscent,
  getMinMaxGrades,
} from '~/services/ascent-helpers'
import { gradeSchema } from '~/schema/ascent'

export async function AscentFormWrapper() {
  const [latestAscent, [minGrade = gradeSchema.parse('7a'), maxGrade = gradeSchema.parse('8a')], allCrags, allAreas] = await Promise.all([
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
