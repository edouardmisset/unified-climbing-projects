'use server'

import type { Grade } from '~/schema/ascent'

export async function GradeSummary({
  gradeAverage,
  gradeFrequency,
  grades,
  highestDegree = 8,
}: {
  gradeAverage: Grade
  gradeFrequency: [Grade, number][] // [Grade, count]
  grades: Grade[]
  highestDegree?: number
}) {
  const climbsInTheHardestDegree = gradeFrequency
    .map(([grade, count]) => [grade, count])
    .filter(([grade, _count]) =>
      String(grade).startsWith(String(highestDegree)),
    )
    .reduce((acc, [_grade, count]) => acc + (count as number), 0)
  return (
    <div id="grades">
      <h2>Grades</h2>
      <p>Hardes grade: {grades.at(-1)}</p>
      <p>Average grade: {gradeAverage}</p>
      <p>
        {climbsInTheHardestDegree} climbs in the {highestDegree}
        <sup>th</sup> degree
      </p>
    </div>
  )
}
