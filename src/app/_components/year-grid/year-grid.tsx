import { type TrainingSession } from '~/types/training'
import { createTrainingTooltip } from '~/helpers/tooltips'
import {
  convertSessionTypeToForeColor,
  convertSessionTypeToBackgroundColor,
  getTrainingSessionColorVariant,
} from '~/helpers/converter'
import Color from 'colorjs.io'

import styles from './year-grid.module.css'

export function YearGrid({
  gridContent,
  year,
}: {
  gridContent: TrainingSession[]
  year: number
}) {
  return (
    <div className={styles.yearGrid}>
      {Array.from({ length: 8 }, (_, index) => {
        const date = new Date()
        date.setFullYear(year)
        date.setMonth(0)
        date.setDate(index)
        return index === 0 ?
            <div
              key="first-cell"
              className={styles.yearGridCell}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
              }}
            />
          : <div
              key={`${index}-day`}
              style={{
                minInlineSize: '4ch',
                lineHeight: 1,
                display: 'flex',
                alignContent: 'center',
              }}
            >
              {date.toDateString().slice(0, 3)}
            </div>
      })}
      {Array.from({ length: 53 }, (_, index) => {
        return index === 0 ? null : (
            <div
              key={`${index}-week`}
              className={`super-center ${styles.yearGridCell} ${styles.gridHeader}`}
              style={{
                minBlockSize: '3ch',
                gridColumn: index + 1,
                gridRow: 1,
                fontWeight: 'bold',
              }}
            >
              {index}
            </div>
          )
      })}
      {gridContent.map(session => {
        const { date, sessionType } = session
        const backgroundColor =
          sessionType === undefined ?
            'hsla(0deg 0% 100% / 0.3)'
          : getTrainingSessionColorVariant(
              new Color(convertSessionTypeToBackgroundColor(sessionType)).to(
                'oklch',
              ),
              session?.intensity ?? 65,
              session?.volume ?? 65,
            ).toString()
        return (
          <i
            key={date.toString()}
            title={createTrainingTooltip(session)}
            className={styles.yearGridCell}
            style={{
              gridColumn: date.weekOfYear + 1,
              gridRow: date.dayOfWeek + 1,
              backgroundColor,
              color: convertSessionTypeToForeColor(sessionType).toString(),
            }}
          />
        )
      })}
    </div>
  )
}
