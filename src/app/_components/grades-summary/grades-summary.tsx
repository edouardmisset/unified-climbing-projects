import { AscentComponent } from '~/app/_components/ascent-component/ascent-component'
import { fromGradeToNumber, fromNumberToGrade } from '~/helpers/converters.ts'
import type { Ascent, Grade } from '~/schema/ascent'

export async function GradeSummary({
  gradeAverage,
  grades,
  ascents,
}: {
  gradeAverage: Grade
  grades: Grade[]
  ascents: Ascent[]
}) {
  const highestDegree = Math.max(...grades.map(grade => Number(grade[0])))
  const numberGrades = grades.map(grade => fromGradeToNumber(grade))
  const maxNumberGrade = Math.max(...numberGrades)
  const highestGrade = fromNumberToGrade(maxNumberGrade)
  const hardestAscent = ascents.find(
    ascent => ascent.topoGrade === highestGrade,
  )

  const ascentsInTheHardestDegree = ascents.filter(({ topoGrade }) =>
    topoGrade.startsWith(highestDegree.toString()),
  ).length

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
