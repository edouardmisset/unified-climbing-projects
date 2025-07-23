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
import { SCORE_INCREMENT } from '../constants'

export function TopTenSummary({ ascents }: { ascents: Ascent[] }) {
  const ascentsWithPoints = ascents.map(ascent => ({
    ...ascent,
    points: fromAscentToPoints(ascent),
  }))

  const topTenAscents = useMemo(
    () => ascentsWithPoints.sort((a, b) => b.points - a.points).slice(0, 10),
    [ascentsWithPoints],
  )

  if (ascents.length === 0 || ascentsWithPoints.length === 0) return undefined

  const lowestTopTenAscent = topTenAscents.findLast(
    ascent =>
      ascent.points === Math.min(...topTenAscents.map(({ points }) => points)),
  )

  const topTenScore = sum(topTenAscents.map(({ points }) => points ?? 0))

  const nextStepPoints = (lowestTopTenAscent?.points ?? 0) + SCORE_INCREMENT
  return (
    <Card>
      <h2>Top Ten</h2>
      <p>
        Your score is <strong>{frenchNumberFormatter(topTenScore)}</strong>
        {lowestTopTenAscent && (
          <>
            <strong className="block">Improve by</strong>
            <span className="block">
              Onsighting a{' '}
              <strong>
                {fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: 'Route',
                  style: 'Onsight',
                })}
              </strong>{' '}
              route
            </span>
            <span className="block">
              Flashing a{' '}
              <strong>
                {fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: 'Route',
                  style: 'Flash',
                })}
              </strong>{' '}
              route
            </span>
            <span className="block">
              Redpointing a{' '}
              <strong>
                {fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: 'Route',
                  style: 'Redpoint',
                })}
              </strong>{' '}
              route
            </span>
            <span className="block">
              Flashing a{' '}
              <strong>
                {displayGrade({
                  climbingDiscipline: 'Boulder',
                  grade: fromPointToGrade(nextStepPoints, {
                    climbingDiscipline: 'Boulder',
                    style: 'Flash',
                  }),
                })}
              </strong>{' '}
              boulder
            </span>
            <span className="block">
              Redpointing a{' '}
              <strong>
                {displayGrade({
                  climbingDiscipline: 'Boulder',
                  grade: fromPointToGrade(nextStepPoints, {
                    climbingDiscipline: 'Boulder',
                    style: 'Redpoint',
                  }),
                })}
              </strong>{' '}
              boulder
            </span>
          </>
        )}
      </p>
    </Card>
  )
}
