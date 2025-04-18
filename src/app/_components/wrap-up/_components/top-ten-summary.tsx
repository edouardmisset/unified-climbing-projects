import { sum } from '@edouardmisset/math'
import { useMemo } from 'react'
import {
  fromAscentToPoints,
  fromPointToGrade,
} from '~/helpers/ascent-converter'
import { frenchNumberFormatter } from '~/helpers/number-formatter'
import type { Ascent } from '~/schema/ascent'
import { Card } from '../../card/card'

export function TopTenSummary({ ascents }: { ascents: Ascent[] }) {
  const ascentsWithPoints = ascents.map(ascent => ({
    ...ascent,
    points: fromAscentToPoints(ascent),
  }))

  if (ascents.length === 0 || ascentsWithPoints.length === 0) return undefined

  const topTenAscents = useMemo(
    () => ascentsWithPoints.sort((a, b) => b.points - a.points).slice(0, 10),
    [ascentsWithPoints],
  )

  const lowestTopTenAscent = topTenAscents.findLast(
    ascent =>
      ascent.points === Math.min(...topTenAscents.map(({ points }) => points)),
  )

  const topTenScore = sum(topTenAscents.map(({ points }) => points ?? 0))

  const nextStepPoints = (lowestTopTenAscent?.points ?? 0) + 50
  return (
    <Card>
      <h2>Top Ten</h2>
      <p>
        Your Top Ten score is{' '}
        <strong>{frenchNumberFormatter(topTenScore)}</strong>
      </p>
      {lowestTopTenAscent && (
        <>
          <h3>To improve Top Ten</h3>
          <p>
            Onsight a{' '}
            <strong>
              {fromPointToGrade(nextStepPoints, {
                climbingDiscipline: 'Route',
                style: 'Onsight',
              })}
            </strong>{' '}
            Route
          </p>
          <p>
            Flash a{' '}
            <strong>
              {fromPointToGrade(nextStepPoints, {
                climbingDiscipline: 'Route',
                style: 'Flash',
              })}
            </strong>{' '}
            route
          </p>
          <p>
            Redpoint a{' '}
            <strong>
              {fromPointToGrade(nextStepPoints, {
                climbingDiscipline: 'Route',
                style: 'Redpoint',
              })}
            </strong>{' '}
            route
          </p>
          <p>
            Flash a{' '}
            <strong>
              {fromPointToGrade(nextStepPoints, {
                climbingDiscipline: 'Boulder',
                style: 'Flash',
              })}
            </strong>{' '}
            boulder
          </p>
          <p>
            Redpoint a{' '}
            <strong>
              {fromPointToGrade(nextStepPoints, {
                climbingDiscipline: 'Boulder',
                style: 'Redpoint',
              })}
            </strong>{' '}
            boulder
          </p>
        </>
      )}
    </Card>
  )
}
