'use client'

import { useQueryState } from 'nuqs'
import type { ReactNode } from 'react'
import { AscentsTrainingSwitch } from '../_components/ascents-training-switch/ascents-training-switch'
import GridLayout from '../_components/grid-layout/grid-layout'
import VisualizationToggleGroup from '../_components/visualization-toggle-group/visualization-toggle-group'
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

  const toggleAscentsOrTraining = () =>
    setAscentOrTraining(state => (state === 'Ascents' ? 'Training' : 'Ascents'))

  const handleQrCodeOrBarcodeChange = (value: unknown[]) => {
    const selectedVisualization = value[0] as VisualizationType
    if (!visualizations.includes(selectedVisualization)) {
      return
    }

    setVisualizationType(selectedVisualization)
  }

  return (
    <div className="w100 flex-column">
      <GridLayout
        title="Visualization"
        additionalContent={
          <div className={`flex-row space-between gap ${styles.header}`}>
            <VisualizationToggleGroup
              onValueChange={handleQrCodeOrBarcodeChange}
              values={visualizations}
              selectedVisualization={selectedVisualization}
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
