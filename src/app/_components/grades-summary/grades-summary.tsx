import { AscentComponent } from '~/app/_components/ascent-component/ascent-component'
import {
  convertGradeToNumber,
  convertNumberToGrade,
} from '~/helpers/converters.ts'
import type { Ascent, Grade } from '~/schema/ascent'
import type { GradeDescription } from '~/server/api/routers/grades'

export async function GradeSummary({
  gradeAverage,
  gradeFrequency,
  grades,
  ascents,
}: {
  gradeAverage: Grade
  gradeFrequency: GradeDescription[]
  grades: Grade[]
  ascents: Ascent[]
}) {
  const highestDegree = Math.max(...grades.map(grade => Number(grade[0])))
  const numberGrades = grades.map(grade => convertGradeToNumber(grade))
  const maxNumberGrade = Math.max(...numberGrades)
  const highestGrade = convertNumberToGrade(maxNumberGrade)
  const hardestAscent = ascents.find(
    ascent => ascent.topoGrade === highestGrade,
  )

  const ascentsInTheHardestDegree = gradeFrequency
    .filter(gradeDescription =>
      String(gradeDescription.grade).startsWith(String(highestDegree)),
    )
    .reduce(
      (acc, { Flash, Onsight, Redpoint }) => acc + (Flash + Onsight + Redpoint),
      0,
    )
  return (
    <div id="grades">
      <h2>Grades</h2>
      {hardestAscent ? (
        <>
          <p>Hardest ascent:</p>{' '}
          <AscentComponent ascent={hardestAscent} showGrade={true} />
        </>
      ) : (
        <p>Hardest grade: {grades.at(-1)}</p>
      )}
      <p>Average grade: {gradeAverage}</p>
      <p>
        {ascentsInTheHardestDegree} climbs in the {highestDegree}
        <sup>th</sup> degree
      </p>
    </div>
  )
}
