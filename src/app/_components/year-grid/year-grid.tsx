import { type TrainingSession } from '~/types/training'
import { createTrainingTooltip } from '~/helpers/tooltips'
import {
  convertSessionTypeToAccentColor,
  convertSessionTypeToBackgroundColor,
  getColorVariant,
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
      {Array.from({ length: 8 }, (_, i) => {
        const d = new Date()
        d.setFullYear(year)
        d.setMonth(0)
        d.setDate(i)
        return i === 0 ?
            <div
              key="first-cell"
              className={styles.yearGridCell}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
              }}
            />
          : <div
              key={`${i}-day`}
              style={{
                minInlineSize: '4ch',
                lineHeight: 1,
                display: 'flex',
                alignContent: 'center',
              }}
            >
              {d.toDateString().slice(0, 3)}
            </div>
      })}
      {Array.from({ length: 53 }, (_, i) => {
        return i === 0 ? null : (
            <div
              key={`${i}-week`}
              className={
                'super-center' +
                ' ' +
                styles.yearGridCell +
                ' ' +
                styles.gridHeader
              }
              style={{
                minBlockSize: '3ch',
                gridColumn: i + 1,
                gridRow: 1,
                fontWeight: 'bold',
              }}
            >
              {i}
            </div>
          )
      })}
      {gridContent.map(session => {
        const { date, sessionType } = session
        const backgroundColor =
          sessionType === undefined ?
            'hsla(0deg 0% 100% / 0.3)'
          : getColorVariant(
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
              color: convertSessionTypeToAccentColor(sessionType).toString(),
            }}
          />
        )
      })}
    </div>
  )
}
