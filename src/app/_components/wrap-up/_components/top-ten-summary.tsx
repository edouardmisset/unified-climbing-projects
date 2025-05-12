import { sum } from '@edouardmisset/math'
import { useMemo } from 'react'
import {
  fromAscentToPoints,
  fromPointToGrade,
} from '~/helpers/ascent-converter'
import { displayGrade } from '~/helpers/display-grade'
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
        Your score is{' '}
        <strong>{frenchNumberFormatter(topTenScore)}</strong>
      </p>
      {lowestTopTenAscent && (
        <>
          <h3>Improve by</h3>
          <p>
            Onsighting a{' '}
            <strong>
              {fromPointToGrade(nextStepPoints, {
                climbingDiscipline: 'Route',
                style: 'Onsight',
              })}
            </strong>{' '}
            route
          </p>
          <p>
            Flashing a{' '}
            <strong>
              {fromPointToGrade(nextStepPoints, {
                climbingDiscipline: 'Route',
                style: 'Flash',
              })}
            </strong>{' '}
            route
          </p>
          <p>
            Redpointing a{' '}
            <strong>
              {fromPointToGrade(nextStepPoints, {
                climbingDiscipline: 'Route',
                style: 'Redpoint',
              })}
            </strong>{' '}
            route
          </p>
          <p>
            Flashing a{' '}
            <strong>
              {displayGrade({
                grade: fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: 'Boulder',
                  style: 'Flash',
                }),
                climbingDiscipline: 'Boulder',
              })}
            </strong>{' '}
            boulder
          </p>
          <p>
            Redpointing a{' '}
            <strong>
              {displayGrade({
                grade: fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: 'Boulder',
                  style: 'Redpoint',
                }),
                climbingDiscipline: 'Boulder',
              })}
            </strong>{' '}
            boulder
          </p>
        </>
      )}
    </Card>
  )
}
