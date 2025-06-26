import { wrapInParentheses } from '@edouardmisset/text'
import { type CSSProperties, useMemo } from 'react'
import { displayGrade } from '~/helpers/display-grade'
import {
  formatComments,
  formatCragAndArea,
  formatHeight,
  formatHolds,
  formatProfile,
  formatRating,
  formatStyleAndTriers,
  fromClimbingDisciplineToEmoji,
  prettyLongDate,
} from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import styles from './ascent-card.module.css'

export function AscentCard({ ascent }: { ascent: Ascent }) {
  const {
    area,
    climbingDiscipline,
    comments,
    crag,
    date,
    height,
    holds,
    profile,
    rating,
    routeName,
    style,
    topoGrade,
    tries,
  } = ascent

  const stylesDependingOnComments: CSSProperties = useMemo(
    () =>
      comments && comments.length > 120
        ? ({ '--direction': 'row' } as CSSProperties)
        : ({ '--direction': 'column' } as CSSProperties),
    [comments],
  )

  const formattedGrade = displayGrade({ climbingDiscipline, grade: topoGrade })
  return (
    <div className={styles.card}>
      <h2
        className={`${styles.header} text-no-wrap`}
        title={`${routeName} ${formattedGrade}`}
      >{`${fromClimbingDisciplineToEmoji(climbingDiscipline)} ${routeName} ${wrapInParentheses(formattedGrade)}`}</h2>
      <div className={styles.content}>
        <div className={styles.placeAndTime}>
          <time>{prettyLongDate(date)}</time>
          <span>{formatCragAndArea(crag, area, { showDetails: true })}</span>
        </div>
        <div className={styles.details} style={stylesDependingOnComments}>
          {[
            formatStyleAndTriers({
              options: { showDetails: true },
              style,
              tries,
            }),
            formatHeight(height),
            formatProfile(profile),
            formatHolds(holds),
            formatRating(rating),
          ]
            .filter(Boolean)
            .map(formattedContent => (
              <span className="text-no-wrap" key={formattedContent}>
                {formattedContent}
              </span>
            ))}
        </div>
        <p>{formatComments(comments)}</p>
      </div>
    </div>
  )
}
