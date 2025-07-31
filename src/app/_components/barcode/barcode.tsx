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
  ({ yearAscents }: { yearAscents: Ascent[][] }) => {
    if (!yearAscents || yearAscents.length === 0) return null

    return (
      <Barcode>
        {yearAscents.map((ascents, index) => (
          <AscentsBar key={ascents[0]?.date ?? index} weeklyAscents={ascents} />
        ))}
      </Barcode>
    )
  },
)

export const TrainingSessionsBarcode = memo(
  ({ yearTraining }: { yearTraining: TrainingSession[][] }) => {
    if (!yearTraining || yearTraining.length === 0) return null

    return (
      <Barcode>
        {yearTraining.map((sessions, index) => (
          <TrainingBar
            key={sessions[0]?.date ?? index}
            weeklyTraining={sessions}
          />
        ))}
      </Barcode>
    )
  },
)
