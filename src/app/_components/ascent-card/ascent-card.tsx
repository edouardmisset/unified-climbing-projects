import { wrapInParentheses } from '@edouardmisset/text'
import type { CSSProperties } from 'react'
import type { AscentRecord } from '~/domain/ascent'
import { formatGrade } from '~/helpers/format-grade'
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
import styles from './ascent-card.module.css'

type CommentDirectionStyle = CSSProperties & {
  '--direction': 'row' | 'column'
}

export function AscentCard({ ascent }: { ascent: AscentRecord }) {
  const {
    area,
    discipline,
    comments,
    crag,
    date,
    height,
    holds,
    profile,
    rating,
    name,
    style,
    grade,
    tries,
  } = ascent

  const maxCommentLength = 120
  const isLongComment = comments !== undefined && comments.length > maxCommentLength
  const stylesDependingOnComments: CommentDirectionStyle = {
    '--direction': isLongComment ? 'row' : 'column',
  }

  const formattedGrade = formatGrade({ discipline, grade })

  return (
    <div className={styles.card}>
      <h2
        className={`${styles.header} textNoWrap`}
        title={`${name} ${formattedGrade}`}
      >{`${fromClimbingDisciplineToEmoji(discipline)} ${name} ${wrapInParentheses(formattedGrade)}`}</h2>
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
              <span className='textNoWrap' key={formattedContent}>
                {formattedContent}
              </span>
            ))}
        </div>
        <span className='block'>{formatComments(comments)}</span>
      </div>
    </div>
  )
}
