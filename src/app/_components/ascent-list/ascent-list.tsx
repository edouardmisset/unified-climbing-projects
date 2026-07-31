import { sum } from '@edouardmisset/math/sum.ts'
import { type CSSProperties, lazy, Suspense, useState } from 'react'
import NotFound from '~/app/not-found'
import { MAX_COLUMNS_THRESHOLD } from '~/constants/generic'
import { fromAscentToPoints } from '~/helpers/ascent-converter'
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
  prettyShortDate,
} from '~/helpers/formatters'
import { formatNumber, formatUnit, frenchNumberFormatter } from '~/helpers/number-formatter'
import { writeAscentsDisciplineText } from '~/helpers/write-ascents-discipline-text'
import type { Ascent } from '~/schema/ascent'
import { GradeTag } from './grade-tag'
import { Dialog } from '../ui/dialog/dialog'
import { Loader } from '../ui/loader/loader'
import styles from './ascent-list.module.css'

const AscentCard = lazy(async () =>
  import('../ascent-card/ascent-card').then(module => ({ default: module.AscentCard })),
)

const BASE_COLUMNS_COUNT = 6
const DETAIL_COLUMNS_COUNT = 4

type TableStyle = CSSProperties & {
  '--columns': number
  '--max-width': string
}

export const AscentList = ({
  ascents,
  showDetails = true,
  showPoints = false,
}: AscentListProps) => {
  const [selectedAscent, setSelectedAscent] = useState<Ascent | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRowClick = (ascent: Ascent) => {
    setSelectedAscent(ascent)
    setIsDialogOpen(true)
  }

  const handleDialogClose = (isOpen: boolean) => {
    setIsDialogOpen(isOpen)
    if (!isOpen) setSelectedAscent(undefined)
  }

  const totalAscentPoints = sum(ascents.map(fromAscentToPoints))

  const columns =
    BASE_COLUMNS_COUNT + (showDetails ? DETAIL_COLUMNS_COUNT : 0) + (showPoints ? 1 : 0)

  const tableStyles: TableStyle = {
    '--columns': columns,
    '--max-width': columns > MAX_COLUMNS_THRESHOLD ? '120ch' : '90ch',
  }

  if (ascents.length === 0) return <NotFound />

  return (
    <>
      <table className={styles.table} style={tableStyles}>
        <thead className={`${styles.header} gridFullWidth`}>
          <tr className={`${styles.headerRow} gridFullWidth`}>
            <th
              aria-label='Discipline'
              className={`${styles.cell} ${styles.headerCell}`}
              title='Discipline: 🧗 route, 🪨 boulder...'
            />
            <th className={`${styles.cell} ${styles.headerCell}`} title='Name of the route'>
              Name
            </th>
            {showPoints && (
              <th className={`${styles.cell} ${styles.headerCell}`} title='Points of the ascent'>
                Points
              </th>
            )}
            <th
              className={`${styles.cell} ${styles.headerCell}`}
              title='French grade of the route as shown in the guide book'
            >
              Grade
            </th>
            <th
              className={`${styles.cell} ${styles.headerCell}`}
              title='Style of the ascent (onsight, flash, redpoint) and # tries'
            >
              Style
            </th>
            <th className={`${styles.cell} ${styles.headerCell}`} title='Date of the ascent'>
              Date
            </th>
            <th
              className={`${styles.cell} ${styles.headerCell}`}
              title='Location (crag and sector if available) of the ascent'
            >
              Location
            </th>

            {showDetails && (
              <>
                <th
                  className={`${styles.cell} ${styles.headerCell}`}
                  title='Most common holds on the route (or boulder) or holds of the crux section'
                >
                  Holds
                </th>
                <th
                  className={`${styles.cell} ${styles.headerCell}`}
                  title='General profile of the route or profile of the crux section'
                >
                  Profile
                </th>
                <th
                  className={`${styles.cell} ${styles.headerCell}`}
                  title='Height of the route in meters'
                >
                  Height
                </th>
                <th
                  className={`${styles.cell} ${styles.headerCell}`}
                  title='Rating of the ascent (out of 5 stars)'
                >
                  Rating
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className={`${styles.body} gridFullWidth`}>
          {ascents.map(ascent => {
            const {
              _id,
              name,
              crag,
              grade,
              date,
              discipline,
              style,
              tries,
              area,
              height,
              holds,
              personalGrade,
              profile,
              rating,
            } = ascent
            const points = fromAscentToPoints(ascent)

            return (
              <tr
                className={`${styles.row} gridFullWidth`}
                key={_id}
                onDoubleClick={() => {
                  handleRowClick(ascent)
                }}
                onKeyDown={event => {
                  if (event.key !== 'Enter' && event.key !== ' ') return

                  event.preventDefault()
                  handleRowClick(ascent)
                }}
                // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
                role='button'
                tabIndex={0}
              >
                <td className={`${styles.cell} marginAuto`} title={discipline}>
                  {fromClimbingDisciplineToEmoji(discipline)}
                </td>
                <td className={styles.cell}>
                  <strong title={name}>{name}</strong>
                </td>
                {showPoints && (
                  <td className={`${styles.cell} monospace`} title={points.toString()}>
                    <strong>{points}</strong>
                  </td>
                )}
                <td className={`${styles.cell} ${styles.gradeTD}`}>
                  <GradeTag discipline={discipline} personalGrade={personalGrade} grade={grade} />
                </td>
                <td className={styles.cell} title={tries === 1 ? style : formatOrdinals(tries)}>
                  <span>{fromAscentStyleToEmoji(style)}</span>
                  <sup>{tries > 1 ? ` ${formatOrdinals(tries)}` : ''}</sup>
                </td>
                <td className={`${styles.cell} monospace`} title={prettyLongDate(date)}>
                  {prettyShortDate(date)}
                </td>
                <td className={styles.cell} title={formatCragAndArea(crag, area)}>
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
                      title={
                        height === undefined
                          ? undefined
                          : formatUnit(height, 'meter', { unitDisplay: 'short' })
                      }
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
          })}
        </tbody>
        <tfoot className={`${styles.footer} gridFullWidth`}>
          <tr className={`${styles.footerRow} gridFullWidth`}>
            {showPoints ? (
              <>
                <th className={`${styles.footerCell} ${styles.cell}`}>Total</th>
                <td className={`${styles.footerCell} ${styles.cell}`} aria-hidden='true' />
                <td className={`${styles.footerCell} ${styles.cell}`}>
                  <strong>{frenchNumberFormatter.format(totalAscentPoints)}</strong>
                </td>
              </>
            ) : (
              <>
                <th className={`${styles.footerCell} ${styles.cell}`}>Total</th>
                <td className={`${styles.footerCell} ${styles.cell}`}>
                  <strong>{formatNumber(ascents.length)}</strong>{' '}
                  {writeAscentsDisciplineText(ascents)}
                </td>
              </>
            )}
          </tr>
        </tfoot>
      </table>

      {selectedAscent !== undefined && (
        <Dialog
          content={
            <Suspense fallback={<Loader />}>
              <AscentCard ascent={selectedAscent} />
            </Suspense>
          }
          onOpenChange={handleDialogClose}
          open={isDialogOpen}
        />
      )}
    </>
  )
}

type AscentListProps = {
  ascents: Ascent[]
  showDetails?: boolean
  showPoints?: boolean
}
