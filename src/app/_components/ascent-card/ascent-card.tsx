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
    climbingDiscipline,
    crag,
    style,
    topoGrade,
    tries,
    comments,
    height,
    holds,
    rating,
    profile,
    area,
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
        className={styles.header}
      >{`${fromClimbingDisciplineToEmoji(climbingDiscipline)} ${routeName} ${addParenthesis(topoGrade)}`}</h2>
      <div className={styles.content}>
        <div className={styles.placeAndTime} style={stylesDependingOnComments}>
          <time>{formatDateInTooltip(ascent)}</time>
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
              <span className={styles.detailsItem} key={formattedContent}>
                {formattedContent}
              </span>
            ))}
        </div>
        <p>{formatComments(comments)}</p>
      </div>
    </div>
  )
}
