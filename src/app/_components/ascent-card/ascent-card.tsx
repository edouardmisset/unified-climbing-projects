import { type CSSProperties, useMemo } from 'react'
import { addParenthesis } from '~/helpers/add-parenthesis'
import {
  formatComments,
  formatCragAndArea,
  formatDateInTooltip,
  formatHeight,
  formatHolds,
  formatProfile,
  formatRating,
  formatStyleAndTriers,
  fromClimbingDisciplineToEmoji,
} from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import styles from './ascent-card.module.css'

export function AscentCard({ ascent }: { ascent: Ascent }) {
  const {
    routeName,
    area,
    climbingDiscipline,
    comments,
    crag,
    date,
    height,
    holds,
    profile,
    rating,
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

  return (
    <div className={styles.card}>
      <h2
        className={`${styles.header} text-no-wrap`}
      >{`${fromClimbingDisciplineToEmoji(climbingDiscipline)} ${routeName} ${addParenthesis(topoGrade)}`}</h2>
      <div className={styles.content}>
        <div className={styles.placeAndTime}>
          <time>{formatDateInTooltip(date)}</time>
          <span>{formatCragAndArea(crag, area, { showDetails: true })}</span>
        </div>
        <div className={styles.details} style={stylesDependingOnComments}>
          {[
            formatStyleAndTriers({
              style,
              tries,
              options: { showDetails: true },
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
