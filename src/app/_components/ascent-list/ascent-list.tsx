import { sum } from '@edouardmisset/math/sum.ts'
import { useMemo } from 'react'
import { NON_BREAKING_SPACE } from '~/constants/generic'
import { displayGrade } from '~/helpers/display-grade'
import { formatOrdinals } from '~/helpers/format-plurals'
import {
  formatCragAndArea,
  formatHeight,
  formatHolds,
  formatProfile,
  formatRating,
  fromAscentStyleToEmoji,
  fromClimbingDisciplineToEmoji,
  prettyLongDate,
} from '~/helpers/formatters'
import { frenchNumberFormatter } from '~/helpers/number-formatter'
import { writeAscentsDisciplineText } from '~/helpers/write-ascents-discipline-text'
import type { Ascent } from '~/schema/ascent'
import styles from './ascent-list.module.css'

export function AscentList({
  ascents,
  showDetails = true,
  showPoints = false,
}: {
  ascents: Ascent[]
  showDetails?: boolean
  showPoints?: boolean
}): React.JSX.Element {
  const totalAscentPoints = useMemo(
    () => sum(ascents.map(({ points }) => points ?? 0)),
    [ascents],
  )
  return (
    <table className={styles.table}>
      <thead className={`${styles.header} grid-full-width`}>
        <tr className={`${styles.headerRow} grid-full-width`}>
          <th
            className={`${styles.cell} ${styles.headerCell}`}
            aria-label="Discipline"
            title="Discipline: 🧗 route, 🪨 boulder..."
          />
          <th
            className={`${styles.cell} ${styles.headerCell}`}
            title="Name of the route"
          >
            Name
          </th>
          {showPoints && (
            <th
              className={`${styles.cell} ${styles.headerCell}`}
              title="Points of the ascent"
            >
              Points
            </th>
          )}
          <th
            className={`${styles.cell} ${styles.headerCell}`}
            title="French grade of the route as shown in the guide book"
          >
            Grade
          </th>
          <th
            className={`${styles.cell} ${styles.headerCell}`}
            title="Style of the ascent (onsight, flash, redpoint) and # tries"
          >
            Style
          </th>
          <th
            className={`${styles.cell} ${styles.headerCell}`}
            title="Date of the ascent"
          >
            Date
          </th>
          <th
            className={`${styles.cell} ${styles.headerCell}`}
            title="Location (crag and sector if available) of the ascent"
          >
            Location
          </th>

          {showDetails && (
            <>
              <th
                className={`${styles.cell} ${styles.headerCell}`}
                title="Most common holds on the route (or boulder) or holds of the crux section"
              >
                Holds
              </th>
              <th
                className={`${styles.cell} ${styles.headerCell}`}
                title="General profile of the route or profile of the crux section"
              >
                Profile
              </th>
              <th
                className={`${styles.cell} ${styles.headerCell}`}
                title="Height of the route in meters"
              >
                Height
              </th>
              <th
                className={`${styles.cell} ${styles.headerCell}`}
                title="Rating of the ascent (out of 5 stars)"
              >
                Rating
              </th>
            </>
          )}
        </tr>
      </thead>
      <tbody className={`${styles.body} grid-full-width`}>
        {ascents.map(
          ({
            id,
            routeName,
            crag,
            topoGrade,
            date,
            climbingDiscipline,
            style,
            tries,
            area,
            height,
            holds,
            personalGrade,
            profile,
            rating,
            points,
          }) => {
            const formattedGrade = displayGrade({
              grade: topoGrade,
              climbingDiscipline,
            })
            return (
              <tr key={id} className={`${styles.row} grid-full-width`}>
                <td
                  title={climbingDiscipline}
                  className={`${styles.cell} margin-auto`}
                >
                  {fromClimbingDisciplineToEmoji(climbingDiscipline)}
                </td>
                <td className={styles.cell}>
                  <strong title={routeName}>{routeName}</strong>
                </td>
                {showPoints && (
                  <td
                    title={points?.toString()}
                    className={`${styles.cell} monospace`}
                  >
                    {points === undefined ? '—' : <strong>{points}</strong>}
                  </td>
                )}
                <td className={styles.cell}>
                  <em
                    title={`Topo Grade: ${formattedGrade}${topoGrade === personalGrade || personalGrade === undefined ? '' : ` - Personal Grade: ${displayGrade({ grade: personalGrade, climbingDiscipline })}`}`}
                    className="monospace"
                  >
                    <span>
                      {formattedGrade.endsWith('+')
                        ? formattedGrade
                        : `${formattedGrade}${NON_BREAKING_SPACE}`}
                    </span>
                    {personalGrade === topoGrade ||
                    personalGrade === undefined ? undefined : (
                      <sup>
                        {' '}
                        {displayGrade({
                          grade: personalGrade,
                          climbingDiscipline,
                        })}
                      </sup>
                    )}
                  </em>
                </td>
                <td
                  title={tries === 1 ? style : formatOrdinals(tries)}
                  className={styles.cell}
                >
                  <span>{fromAscentStyleToEmoji(style)}</span>
                  <sup>{tries > 1 ? ` ${formatOrdinals(tries)}` : ''}</sup>
                </td>
                <td
                  title={prettyLongDate(date, 'longDate')}
                  className={`${styles.cell} monospace`}
                >
                  {prettyLongDate(date, 'shortDate')}
                </td>
                <td
                  title={formatCragAndArea(crag, area)}
                  className={styles.cell}
                >
                  {formatCragAndArea(crag, area)}
                </td>
                {showDetails && (
                  <>
                    <td title={holds} className={styles.cell}>
                      {formatHolds(holds)}
                    </td>
                    <td title={profile} className={styles.cell}>
                      {formatProfile(profile)}
                    </td>
                    <td
                      title={height === undefined ? undefined : `${height}m`}
                      className={`${styles.cell} monospace`}
                    >
                      {formatHeight(height)}
                    </td>
                    <td
                      title={rating === undefined ? undefined : `${rating}⭐️`}
                      className={styles.cell}
                    >
                      {formatRating(rating)}
                    </td>
                  </>
                )}
              </tr>
            )
          },
        )}
      </tbody>
      <tfoot className={`${styles.footer} grid-full-width`}>
        <tr className={`${styles.footerRow} grid-full-width`}>
          {showPoints ? (
            <>
              <th className={`${styles.footerCell} ${styles.cell}`}>Total</th>
              <td className={`${styles.footerCell} ${styles.cell}`} />
              <td className={`${styles.footerCell} ${styles.cell}`}>
                <strong>{frenchNumberFormatter(totalAscentPoints)}</strong>
              </td>
            </>
          ) : (
            <>
              <th className={`${styles.footerCell} ${styles.cell}`}>Total</th>
              <td className={`${styles.footerCell} ${styles.cell}`}>
                <strong>{ascents.length}</strong>{' '}
                {writeAscentsDisciplineText(ascents)}
              </td>
            </>
          )}
        </tr>
      </tfoot>
    </table>
  )
}
