import { sum } from '@edouardmisset/math'
import { useMemo } from 'react'
import {
  fromAscentToPoints,
  fromPointToGrade,
} from '~/helpers/ascent-converter'
import { frenchNumberFormatter } from '~/helpers/number-formatter'
import type { AscentListProps } from '~/schema/ascent'
import { Card } from '../../card/card'
import { ClimbingStyle } from '../../climbing/climbing-style/climbing-style'
import { DisplayGrade } from '../../climbing/display-grade/display-grade'
import { SCORE_INCREMENT } from '../constants'

export function TopTenSummary({ ascents }: AscentListProps) {
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
              <ClimbingStyle climbingStyle="Onsighting" /> a{' '}
              <DisplayGrade
                climbingDiscipline="Route"
                grade={fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: 'Route',
                  style: 'Onsight',
                })}
              />{' '}
              route
            </span>
            <span className="block">
              <ClimbingStyle climbingStyle="Flashing" /> a{' '}
              <DisplayGrade
                climbingDiscipline="Route"
                grade={fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: 'Route',
                  style: 'Flash',
                })}
              />{' '}
              route
            </span>
            <span className="block">
              <ClimbingStyle climbingStyle="Redpointing" /> a{' '}
              <DisplayGrade
                climbingDiscipline="Route"
                grade={fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: 'Route',
                  style: 'Redpoint',
                })}
              />{' '}
              route
            </span>
            <span className="block">
              <ClimbingStyle climbingStyle="Flashing" /> a{' '}
              <DisplayGrade
                climbingDiscipline="Boulder"
                grade={fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: 'Boulder',
                  style: 'Flash',
                })}
              />{' '}
              boulder
            </span>
            <span className="block">
              <ClimbingStyle climbingStyle="Redpointing" /> a{' '}
              <DisplayGrade
                climbingDiscipline="Boulder"
                grade={fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: 'Boulder',
                  style: 'Redpoint',
                })}
              />{' '}
              boulder
            </span>
          </>
        )}
      </p>
    </Card>
  )
}
