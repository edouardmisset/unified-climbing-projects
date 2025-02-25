'use client'
import { type ReactNode, useState } from 'react'
import Barcode from '~/app/_components/barcode/barcode'
import { groupDataDaysByYear, groupDataWeeksByYear } from '~/data/helpers'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { api } from '~/trpc/react'
import { AscentsTrainingSwitch } from '../_components/ascents-training-switch/ascents-training-switch'
import { AscentsBar } from '../_components/barcode/ascents-bar'
import { TrainingBar } from '../_components/barcode/training-bar'
import CodeModal from '../_components/code-dialog/code-dialog'
import GridLayout from '../_components/grid-layout/grid-layout'
import { Loader } from '../_components/loader/loader'
import { AscentsQRDot } from '../_components/qr-code/ascents-qr-dot'
import QRCode from '../_components/qr-code/qr-code'
import { TrainingsQRDot } from '../_components/qr-code/trainings-qr-dot'
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

  const controls = (
    <div className={`flex-row space-between gap ${styles.header}`}>
      <VisualizationToggleGroup
        onValueChange={handleQrCodeOrBarcodeChange}
        values={visualizations}
      />
      <AscentsTrainingSwitch toggle={toggleAscentsOrTraining} />
    </div>
  )

  let content: ReactNode = undefined
  if (ascentsOrTraining === 'Ascents' && qrCodeOrBarcode === 'QR Code') {
    content = (
      <GridLayout title="Ascents" additionalContent={controls}>
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
                  <CodeModal
                    title={year}
                    content={
                      <QRCode>
                        {sortedAscents.map((ascents, index) => (
                          <AscentsQRDot
                            ascents={ascents}
                            key={ascents[0]?.date ?? index}
                          />
                        ))}
                      </QRCode>
                    }
                  />
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
      <GridLayout title="Ascents" additionalContent={controls}>
        {Object.entries(groupDataWeeksByYear(ascents))
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, yearAscents]) => (
            <div key={year} className="flex-column w100">
              <h2 className="center-text">
                <CodeModal
                  title={year}
                  content={
                    <Barcode>
                      {yearAscents.map((ascents, index) => (
                        <AscentsBar
                          key={ascents[0]?.date ?? index}
                          weeklyAscents={ascents}
                        />
                      ))}
                    </Barcode>
                  }
                />
              </h2>
              <Barcode>
                {yearAscents.map((weeklyAscents, index) => (
                  <AscentsBar
                    key={weeklyAscents[0]?.date ?? index}
                    weeklyAscents={weeklyAscents}
                  />
                ))}
              </Barcode>
            </div>
          ))}
      </GridLayout>
    )
  } else if (
    ascentsOrTraining === 'Training' &&
    qrCodeOrBarcode === 'QR Code'
  ) {
    content = (
      <GridLayout title="Training" additionalContent={controls}>
        {Object.entries(groupDataDaysByYear(trainingSessions))
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, yearlyTraining]) => (
            <div key={year}>
              <h2 className="center-text">
                <CodeModal
                  title={year}
                  content={
                    <QRCode>
                      {yearlyTraining.map((trainingSessions, index) => (
                        <TrainingsQRDot
                          trainingSessions={trainingSessions}
                          key={trainingSessions[0]?.date ?? index}
                        />
                      ))}
                    </QRCode>
                  }
                />
              </h2>
              <QRCode>
                {yearlyTraining.map((trainingSessions, index) => (
                  <TrainingsQRDot
                    trainingSessions={trainingSessions}
                    key={trainingSessions[0]?.date ?? index}
                  />
                ))}
              </QRCode>
            </div>
          ))}
      </GridLayout>
    )
  } else if (
    ascentsOrTraining === 'Training' &&
    qrCodeOrBarcode === 'Barcode'
  ) {
    content = (
      <GridLayout title="Training" additionalContent={controls}>
        {Object.entries(groupDataWeeksByYear(trainingSessions))
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, yearTraining]) => (
            <div key={year} className="flex-column w100">
              <h2 className="center-text">
                <CodeModal
                  title={year}
                  content={
                    <Barcode>
                      {yearTraining.map((weeklyTraining, index) => (
                        <TrainingBar
                          key={weeklyTraining[0]?.date ?? index}
                          weeklyTraining={weeklyTraining}
                        />
                      ))}
                    </Barcode>
                  }
                />
              </h2>
              <Barcode>
                {yearTraining.map((weeklyTraining, index) => (
                  <TrainingBar
                    key={weeklyTraining[0]?.date ?? index}
                    weeklyTraining={weeklyTraining}
                  />
                ))}
              </Barcode>
            </div>
          ))}
      </GridLayout>
    )
  }

  if (!content) {
    return <NotFound />
  }

  return <div className={'w100 flex-column'}>{content}</div>
}
