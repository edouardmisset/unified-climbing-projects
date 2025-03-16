'use client'

import { useQueryState } from 'nuqs'
import { type ReactNode, useCallback } from 'react'
import { AscentsTrainingSwitch } from '~/app/_components/ascents-training-switch/ascents-training-switch'
import GridLayout from '~/app/_components/grid-layout/grid-layout'
import { ToggleGroup } from '~/app/_components/toggle-group/toggle-group'
import {
  type AscentsOrTrainingType,
  type VisualizationType,
  ascentsOrTrainingSchema,
  visualizationSchema,
  visualizations,
} from './constants'
import styles from './page.module.css'

export default function Layout({ children }: { children: ReactNode }) {
  const [ascentsOrTraining, setAscentOrTraining] =
    useQueryState<AscentsOrTrainingType>('ascentsOrTraining', {
      defaultValue: 'Ascents',
      parse: value => ascentsOrTrainingSchema.parse(value),
    })

  const [selectedVisualization, setVisualizationType] =
    useQueryState<VisualizationType>('visualization', {
      defaultValue: 'QR Code',
      parse: value => visualizationSchema.parse(value),
    })

  const toggleAscentsOrTraining = useCallback(
    () =>
      setAscentOrTraining(state =>
        state === 'Ascents' ? 'Training' : 'Ascents',
      ),
    [setAscentOrTraining],
  )

  const handleQrCodeOrBarcodeChange = useCallback(
    (value: unknown[]) => {
      const result = visualizationSchema.safeParse(value[0])
      if (!result.success) return

      setVisualizationType(result.data)
    },
    [setVisualizationType],
  )

  return (
    <div className="w100 flex-column">
      <GridLayout
        title="Visualization"
        additionalContent={
          <div className={`flex-row space-between gap ${styles.header}`}>
            <ToggleGroup
              onValueChange={handleQrCodeOrBarcodeChange}
              values={visualizations}
              selectedValue={selectedVisualization}
            />
            <AscentsTrainingSwitch
              toggle={toggleAscentsOrTraining}
              isTraining={ascentsOrTraining === 'Training'}
            />
          </div>
        }
      >
        {children}
      </GridLayout>
    </div>
  )
}
