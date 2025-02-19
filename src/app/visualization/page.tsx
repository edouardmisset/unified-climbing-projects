'use client'

import { Link } from 'next-view-transitions'
import { useState } from 'react'
import { getYearAscentPerDay, getYearsAscentsPerWeek } from '~/data/ascent-data'
import { groupDataDaysByYear } from '~/data/helpers'
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
import GridLayout from '../_components/grid-layout/grid-layout'
import { Loader } from '../_components/loader/loader'
import { AscentsQRDot } from '../_components/qr-code/ascents-qr-dot'
import QRCode from '../_components/qr-code/qr-code'
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

  let content = undefined

  if (ascentsOrTraining === 'Ascents' && qrCodeOrBarcode === 'QR Code') {
    content = (
      <GridLayout title="Ascents">
        {Object.entries(groupDataDaysByYear(ascents))
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, yearlyAscents]) => {
            if (yearlyAscents === undefined)
              return <span>Unexpected error </span>

            const sortedAscents = yearlyAscents.map(ascents =>
              ascents.toSorted((a, b) => sortByDescendingGrade(a, b)),
            )
            return (
              <div key={year}>
                <h2 className="center-text">
                  <Link href={`/ascents/qr-code/${year}`} prefetch={true}>
                    {year}
                  </Link>
                </h2>
                <QRCode>
                  {sortedAscents.map((ascents, index) => (
                    <AscentsQRDot
                      ascents={ascents}
                      key={ascents[0]?.date ?? index}
                    />
                  ))}
                </QRCode>
              </div>
            )
          })}
      </GridLayout>
    )
  } else if (ascentsOrTraining === 'Ascents' && qrCodeOrBarcode === 'Barcode') {
    content = (
      <GenericBarcodeByYear
        allData={ascents}
        getYearData={getYearsAscentsPerWeek}
        linkPrefix="ascents"
        barRender={ascentsBarcodeRender}
      />
    )
  } else if (
    ascentsOrTraining === 'Training' &&
    qrCodeOrBarcode === 'QR Code'
  ) {
    content = (
      <GenericQrCodeByYear
        allData={trainingSessions}
        getYearData={getYearTraining}
        dotRender={trainingSessionsQRCodeRender}
        linkPrefix="training"
      />
    )
  } else if (
    ascentsOrTraining === 'Training' &&
    qrCodeOrBarcode === 'Barcode'
  ) {
    content = (
      <GenericBarcodeByYear
        allData={trainingSessions}
        getYearData={getYearsTrainingPerWeek}
        linkPrefix="training"
        barRender={trainingSessionsBarcodeRender}
      />
    )
  }

  if (!content) {
    return <NotFound />
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
      {content}
    </div>
  )
}
