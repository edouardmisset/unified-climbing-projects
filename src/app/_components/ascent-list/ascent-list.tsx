import { sum } from '@edouardmisset/math/sum.ts'
import { useMemo } from 'react'
import { NON_BREAKING_SPACE } from '~/constants/generic'
import { formatGrade } from '~/helpers/format-grade'
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
import { DisplayGrade } from '../climbing/display-grade/display-grade'
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
            aria-label="Discipline"
            className={`${styles.cell} ${styles.headerCell}`}
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
            const formattedGrade = formatGrade({
              climbingDiscipline,
              grade: topoGrade,
            })
            return (
              <tr className={`${styles.row} grid-full-width`} key={id}>
                <td
                  className={`${styles.cell} margin-auto`}
                  title={climbingDiscipline}
                >
                  {fromClimbingDisciplineToEmoji(climbingDiscipline)}
                </td>
                <td className={styles.cell}>
                  <strong title={routeName}>{routeName}</strong>
                </td>
                {showPoints && (
                  <td
                    className={`${styles.cell} monospace`}
                    title={points?.toString()}
                  >
                    {points === undefined ? '—' : <strong>{points}</strong>}
                  </td>
                )}
                <td className={styles.cell}>
                  <em
                    className="monospace"
                    title={`Topo Grade: ${formattedGrade}${topoGrade === personalGrade || personalGrade === undefined ? '' : ` - Personal Grade: ${formatGrade({ climbingDiscipline, grade: personalGrade })}`}`}
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
                        <DisplayGrade
                          climbingDiscipline={climbingDiscipline}
                          grade={personalGrade}
                        />
                      </sup>
                    )}
                  </em>
                </td>
                <td
                  className={styles.cell}
                  title={tries === 1 ? style : formatOrdinals(tries)}
                >
                  <span>{fromAscentStyleToEmoji(style)}</span>
                  <sup>{tries > 1 ? ` ${formatOrdinals(tries)}` : ''}</sup>
                </td>
                <td
                  className={`${styles.cell} monospace`}
                  title={prettyLongDate(date, 'longDate')}
                >
                  {prettyLongDate(date, 'shortDate')}
                </td>
                <td
                  className={styles.cell}
                  title={formatCragAndArea(crag, area)}
                >
                  {formatCragAndArea(crag, area)}
                </td>
                {showDetails && (
                  <>
                    <td className={styles.cell} title={holds}>
                      {formatHolds(holds)}
                    </td>
                    <td className={styles.cell} title={profile}>
                      {formatProfile(profile)}
                    </td>
                    <td
                      className={`${styles.cell} monospace`}
                      title={height === undefined ? undefined : `${height}m`}
                    >
                      {formatHeight(height)}
                    </td>
                    <td
                      className={styles.cell}
                      title={rating === undefined ? undefined : `${rating}⭐️`}
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
