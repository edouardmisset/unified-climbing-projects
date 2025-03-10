'use client'

import { useQueryState } from 'nuqs'
import { AscentsBar } from '~/app/_components/barcode/ascents-bar'
import Barcode from '~/app/_components/barcode/barcode'
import { TrainingBar } from '~/app/_components/barcode/training-bar'
import DataCalendar from '~/app/_components/data-calendar/data-calendar'
import Dialog from '~/app/_components/dialog/dialog'
import { AscentsQRDot } from '~/app/_components/qr-code/ascents-qr-dot'
import QRCode from '~/app/_components/qr-code/qr-code'
import { TrainingsQRDot } from '~/app/_components/qr-code/trainings-qr-dot'
import NotFound from '~/app/not-found'
import { groupDataDaysByYear, groupDataWeeksByYear } from '~/data/helpers'
import { fromAscentsToCalendarEntries } from '~/helpers/ascent-calendar-helpers'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { fromTrainingSessionsToCalendarEntries } from '~/helpers/training-calendar-helpers'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import {
  type AscentsOrTrainingType,
  type VisualizationType,
  ascentsOrTrainingSchema,
  visualizationSchema,
} from '../../constants'
import { GridBreakOutWrapper } from '../grid-break-out-wrapper/grid-break-out-wrapper'

type VisualizationContentProps = {
  allAscents: Ascent[]
  trainingSessions: TrainingSession[]
  ascentYears: number[]
  trainingYears: number[]
}

export function VisualizationContent(props: VisualizationContentProps) {
  const { allAscents, trainingSessions, ascentYears, trainingYears } = props
  const [ascentsOrTraining] = useQueryState<AscentsOrTrainingType>(
    'ascentsOrTraining',
    {
      defaultValue: 'Ascents',
      parse: value => ascentsOrTrainingSchema.parse(value),
    },
  )

  const [visualizationType] = useQueryState<VisualizationType>(
    'visualization',
    {
      defaultValue: 'QR Code',
      parse: value => visualizationSchema.parse(value),
    },
  )

  if (ascentsOrTraining === 'Ascents' && visualizationType === 'QR Code') {
    return Object.entries(groupDataDaysByYear(allAscents))
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, yearlyAscents]) => {
        if (yearlyAscents === undefined) return <span>Unexpected error</span>
        const sortedAscents = yearlyAscents.map(ascents =>
          ascents.toSorted((a, b) => sortByDescendingGrade(a, b)),
        )
        return (
          <div key={year}>
            <h2 className="center-text">
              <Dialog
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
      })
  }

  if (ascentsOrTraining === 'Ascents' && visualizationType === 'Barcode') {
    return Object.entries(groupDataWeeksByYear(allAscents))
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, yearAscents]) => (
        <div key={year} className="flex-column w100">
          <h2 className="center-text">
            <Dialog
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
      ))
  }

  if (ascentsOrTraining === 'Ascents' && visualizationType === 'Calendar') {
    return ascentYears.map(year => (
      <GridBreakOutWrapper key={year}>
        <h2>{year}</h2>
        <DataCalendar
          key={year}
          year={year}
          data={allAscents}
          dataTransformationFunction={groupDataDaysByYear}
          fromDataToCalendarEntries={fromAscentsToCalendarEntries}
        />
      </GridBreakOutWrapper>
    ))
  }

  if (ascentsOrTraining === 'Training' && visualizationType === 'QR Code') {
    return Object.entries(groupDataDaysByYear(trainingSessions))
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, yearlyTraining]) => (
        <div key={year}>
          <h2 className="center-text">
            <Dialog
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
      ))
  }

  if (ascentsOrTraining === 'Training' && visualizationType === 'Barcode') {
    return Object.entries(groupDataWeeksByYear(trainingSessions))
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, yearTraining]) => (
        <div key={year} className="flex-column w100">
          <h2 className="center-text">
            <Dialog
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
      ))
  }

  if (ascentsOrTraining === 'Training' && visualizationType === 'Calendar') {
    return trainingYears.map(year => (
      <GridBreakOutWrapper key={year}>
        <h2>{year}</h2>
        <DataCalendar
          year={year}
          data={trainingSessions}
          dataTransformationFunction={groupDataDaysByYear}
          fromDataToCalendarEntries={fromTrainingSessionsToCalendarEntries}
        />
      </GridBreakOutWrapper>
    ))
  }

  return <NotFound />
}
