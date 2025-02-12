'use client'

import { useState } from 'react'
import { getYearAscentPerDay, getYearsAscentsPerWeek } from '~/data/ascent-data'
import { getYearTraining, getYearsTrainingPerWeek } from '~/data/training-data'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { api } from '~/trpc/react'
import { ascentsBarcodeRender } from '../../helpers/ascents-barcode-helpers'
import { ascentsQRCodeRender } from '../../helpers/ascents-qr-code-helpers'
import { trainingSessionsBarcodeRender } from '../../helpers/training-barcode-helpers'
import { trainingSessionsQRCodeRender } from '../../helpers/training-qr-code-helpers'
import { AscentsTrainingSwitch } from '../_components/ascents-training-switch/ascents-training-switch'
import { GenericBarcodeByYear } from '../_components/generic-barcode-by-year/generic-barcode-by-year'
import { GenericQrCodeByYear } from '../_components/generic-qr-code-by-year/generic-qr-code-by-year'
import { Loader } from '../_components/loader/loader'
import VisualizationToggleGroup from '../_components/visualization-toggle-group/visualization-toggle-group'
import NotFound from '../not-found'
import {
  type AscentsOrTrainingType,
  type VisualizationType,
  ascentsOrTrainingList,
  visualizations,
} from './constants'
import styles from './page.module.css'

export default function Visualisation() {
  const [ascentsOrTraining, setAscentOrTraining] =
    useState<AscentsOrTrainingType>(ascentsOrTrainingList[0])

  const [qrCodeOrBarcode, setQrCodeOrBarcode] = useState<VisualizationType>(
    visualizations[0],
  )

  const { data: ascents, isLoading: isAscentsLoading } =
    api.ascents.getAllAscents.useQuery()
  const { data: trainingSessions, isLoading: isTrainingLoading } =
    api.training.getAllTrainingSessions.useQuery()

  const toggleAscentsOrTraining = () =>
    setAscentOrTraining(state => (state === 'Ascents' ? 'Training' : 'Ascents'))

  if (isAscentsLoading || isTrainingLoading) return <Loader />
  if (!ascents || !trainingSessions) return <NotFound />

  const handleQrCodeOrBarcodeChange = (value: unknown[]) => {
    const selectedVisualization = value[0] as VisualizationType
    if (!visualizations.includes(selectedVisualization)) {
      return
    }

    setQrCodeOrBarcode(selectedVisualization)
  }

  return (
    <div className={'w100 flex-column'}>
      {/* Header with Visualization, Title (Ascents or Training), switch */}
      <div className={`flex-row space-between ${styles.header}`}>
        <VisualizationToggleGroup
          onValueChange={handleQrCodeOrBarcodeChange}
          values={visualizations}
        />
        <h1>{ascentsOrTraining}</h1>
        <AscentsTrainingSwitch toggle={toggleAscentsOrTraining} />
      </div>
      {/* Main Content: QR Codes, Barcodes, etc. */}
      <section className="w100 grid">
        {ascentsOrTraining === 'Ascents' ? (
          qrCodeOrBarcode === 'QR Code' ? (
            <GenericQrCodeByYear
              allData={ascents}
              getYearData={getYearAscentPerDay}
              dotRender={ascentsQRCodeRender}
              linkPrefix="ascents"
              processGroup={group =>
                group.map(ascentDay => ({
                  ...ascentDay,
                  ascents: ascentDay?.ascents
                    ? ascentDay.ascents.toSorted((a, b) =>
                        sortByDescendingGrade(a, b),
                      )
                    : undefined,
                }))
              }
            />
          ) : (
            <GenericBarcodeByYear
              allData={ascents}
              getYearData={getYearsAscentsPerWeek}
              linkPrefix="ascents"
              barRender={ascentsBarcodeRender}
            />
          )
        ) : qrCodeOrBarcode === 'QR Code' ? (
          <GenericQrCodeByYear
            allData={trainingSessions}
            getYearData={getYearTraining}
            dotRender={trainingSessionsQRCodeRender}
            linkPrefix="training"
          />
        ) : (
          <GenericBarcodeByYear
            allData={trainingSessions}
            getYearData={getYearsTrainingPerWeek}
            linkPrefix="training"
            barRender={trainingSessionsBarcodeRender}
          />
        )}
      </section>
    </div>
  )
}
