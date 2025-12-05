'use client'

import { memo, type ReactNode } from 'react'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { AscentsBar } from './ascents-bar'
import styles from './barcode.module.css'
import { TrainingBar } from './training-bar'

const Barcode = memo((props: { children: ReactNode }) => {
  const { children } = props

  return (
    <div className={styles.barcode} role="img">
      {children}
    </div>
  )
})

export const AscentsBarcode = memo(
  ({ yearlyAscents }: { yearlyAscents: Ascent[][] }) => {
    if (!yearlyAscents || yearlyAscents.length === 0) return null

    return (
      <Barcode>
        {yearlyAscents.map((ascents, index) => (
          <AscentsBar key={ascents[0]?.date ?? index} weeklyAscents={ascents} />
        ))}
      </Barcode>
    )
  },
)

export const TrainingSessionsBarcode = memo(
  ({ yearlyTraining }: { yearlyTraining: TrainingSession[][] }) => {
    if (!yearlyTraining || yearlyTraining.length === 0) return null

    return (
      <Barcode>
        {yearlyTraining.map((sessions, index) => (
          <TrainingBar
            key={sessions[0]?.date ?? index}
            weeklyTraining={sessions}
          />
        ))}
      </Barcode>
    )
  },
)
