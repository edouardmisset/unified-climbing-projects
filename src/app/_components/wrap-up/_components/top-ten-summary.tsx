import { sum } from '@edouardmisset/math'
import { useMemo } from 'react'
import { addPoints, fromAscentToPoints, fromPointToGrade } from '~/helpers/ascent-converter'
import { frenchNumberFormatter } from '~/helpers/number-formatter'
import { ascentStyleSchema, climbingDisciplineSchema, type AscentListProps, pointsSchema } from '~/schema/ascent'
import { Card } from '../../ui/card/card'
import { ClimbingStyle } from '../../climbing/climbing-style/climbing-style'
import { DisplayGrade } from '../../climbing/display-grade/display-grade'
import { SCORE_INCREMENT } from '../constants'

const ZERO_POINTS = pointsSchema.parse(0)
const SCORE_INCREMENT_POINTS = pointsSchema.parse(SCORE_INCREMENT)

const ROUTE = climbingDisciplineSchema.parse('Route')
const BOULDER = climbingDisciplineSchema.parse('Boulder')
const ONSIGHT = ascentStyleSchema.parse('Onsight')
const FLASH = ascentStyleSchema.parse('Flash')
const REDPOINT = ascentStyleSchema.parse('Redpoint')

export function TopTenSummary({ ascents }: AscentListProps) {
  const ascentsWithPoints = ascents.map(ascent => ({
    ...ascent,
    points: fromAscentToPoints(ascent),
  }))

  const isMultipleYears =
    new Set(ascents.map(ascent => new Date(ascent.date).getFullYear())).size > 1

  const topTenAscents = useMemo(
    () => ascentsWithPoints.toSorted((a, b) => b.points - a.points).slice(0, 10),
    [ascentsWithPoints],
  )

  if (ascents.length === 0 || ascentsWithPoints.length === 0) return

  const lowestTopTenAscent = topTenAscents.findLast(
    ascent => ascent.points === Math.min(...topTenAscents.map(({ points }) => points)),
  )

  const topTenScore = sum(topTenAscents.map(({ points }) => points ?? 0))

  const nextStepPoints = addPoints(
    lowestTopTenAscent?.points ?? ZERO_POINTS,
    SCORE_INCREMENT_POINTS,
  )
  const displayHowToImprove =
    lowestTopTenAscent &&
    (new Date().getFullYear() === new Date(lowestTopTenAscent.date).getFullYear() ||
      isMultipleYears)

  return (
    <Card>
      <h2>Top Ten</h2>
      <p>
        Your score is <strong>{frenchNumberFormatter.format(topTenScore)}</strong>
        {displayHowToImprove === true && (
          <>
            <strong className='block'>Improve by</strong>
            <span className='block'>
              Lead climb{' '}
              <DisplayGrade
                climbingDiscipline={ROUTE}
                grade={fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: ROUTE,
                  style: ONSIGHT,
                })}
              />{' '}
              <ClimbingStyle climbingStyle='Onsight' />,{' '}
              <DisplayGrade
                climbingDiscipline={ROUTE}
                grade={fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: ROUTE,
                  style: FLASH,
                })}
              />{' '}
              <ClimbingStyle climbingStyle='Flash' /> or{' '}
              <DisplayGrade
                climbingDiscipline={ROUTE}
                grade={fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: ROUTE,
                  style: REDPOINT,
                })}
              />{' '}
              <ClimbingStyle climbingStyle='Redpoint' />
            </span>

            <span className='block'>
              Boulder{' '}
              <DisplayGrade
                climbingDiscipline={BOULDER}
                grade={fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: BOULDER,
                  style: FLASH,
                })}
              />{' '}
              <ClimbingStyle climbingStyle='Flash' /> or{' '}
              <DisplayGrade
                climbingDiscipline={BOULDER}
                grade={fromPointToGrade(nextStepPoints, {
                  climbingDiscipline: BOULDER,
                  style: REDPOINT,
                })}
              />{' '}
              <ClimbingStyle climbingStyle='Redpoint' />
            </span>
          </>
        )}
      </p>
    </Card>
  )
}
