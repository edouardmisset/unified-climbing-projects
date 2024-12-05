'use server'

import {
  convertGradeToNumber,
  convertNumberToGrade,
} from '~/helpers/converters.ts'
import type { Ascent, Grade } from '~/schema/ascent'
import { AscentComponent } from '../ascent-component/ascent-component.tsx'

export async function GradeSummary({
  gradeAverage,
  gradeFrequency,
  grades,
  ascents,
}: {
  gradeAverage: Grade
  gradeFrequency: [Grade, number][] // [Grade, count]
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
    .map(([grade, count]) => [grade, count])
    .filter(([grade, _count]) =>
      String(grade).startsWith(String(highestDegree)),
    )
    .reduce((acc, [_grade, count]) => acc + (count as number), 0)
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
