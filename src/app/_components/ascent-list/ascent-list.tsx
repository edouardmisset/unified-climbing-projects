'use client'
import { Fragment } from 'react'
import {
  formatCragAndArea,
  formatDateInTooltip,
  formatHeight,
  formatHolds,
  formatOrdinals,
  formatProfile,
  formatRating,
  fromAscentStyleToEmoji,
  fromClimbingDisciplineToEmoji,
} from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import styles from './ascent-list.module.css'

export function AscentList({ ascents }: { ascents: Ascent[] }) {
  return (
    <div className={styles.grid}>
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
        }) => (
          <Fragment key={id}>
            <span title={climbingDiscipline} className={styles.item}>
              {fromClimbingDisciplineToEmoji(climbingDiscipline)}
            </span>
            <strong title={routeName} className={styles.item}>
              {routeName}
            </strong>
            <em
              title={`${topoGrade} - ${personalGrade}`}
              className={styles.item}
            >
              {topoGrade}{' '}
              {personalGrade === topoGrade ? null : <sup>{personalGrade}</sup>}
            </em>

            <span
              title={tries === 1 ? style : formatOrdinals(tries)}
              className={styles.item}
            >
              <span>{fromAscentStyleToEmoji(style)}</span>
              <sup>{tries > 1 ? ` ${formatOrdinals(tries)}` : ''}</sup>
            </span>
            <span
              title={formatDateInTooltip(date, 'longDate')}
              className={styles.item}
            >
              {formatDateInTooltip(date, 'shortDate')}
            </span>

            <span title={formatCragAndArea(crag, area)} className={styles.item}>
              {formatCragAndArea(crag, area)}
            </span>

            <span title={`${height}m`} className={styles.item}>
              {formatHeight(height)}
            </span>
            <span title={profile} className={styles.item}>
              {formatProfile(profile)}
            </span>
            <span title={holds} className={styles.item}>
              {formatHolds(holds)}
            </span>

            <span title={`${rating}⭐️`} className={styles.item}>
              {formatRating(rating)}
            </span>
          </Fragment>
        ),
      )}
    </div>
  )
}
