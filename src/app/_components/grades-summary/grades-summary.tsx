'use server'

import type { Grade } from '~/schema/ascent'

export async function GradeSummary({
  gradeAverage,
  gradeFrequency,
  grades,
}: {
  gradeAverage: Grade
  gradeFrequency: [Grade, number][]
  grades: Grade[]
}) {
  return (
    <div id="grades">
      <h2>Grades</h2>
      <p>Hardes grade: {grades.at(-1)}</p>
      <p>Average grade: {gradeAverage}</p>
      <p>
        Most climbed grade:{' '}
        {gradeFrequency
          .map(([grade, count]) => [grade, count])
          .sort(([_a, a], [_b, b]) => {
            if (typeof a === 'number' && typeof b === 'number') return b - a
            return 0
          })[0]
          ?.join(' - ')}{' '}
        climbs
      </p>
    </div>
  )
}
