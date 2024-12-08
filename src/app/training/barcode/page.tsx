import Link from 'next/link'
import Barcode, { maxBarWidth } from '~/app/_components/barcode/barcode'
import { createYearList } from '~/data/ascent-data'
import { getYearsTrainingPerWeek } from '~/data/training-data'
import { convertSessionTypeToBackgroundColor } from '~/helpers/converter'
import { convertSessionTypeToSortOrder } from '~/helpers/sorter'
import { createTrainingBarCodeTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'

export default async function Page() {
  const trainingSessions = await api.training.getAllTrainingSessions()

  return (
    <section
      className="w100"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1rem',
      }}
    >
      {Object.values(getYearsTrainingPerWeek(trainingSessions))
        .map((yearTraining, i) => {
          const trainingYear = createYearList(trainingSessions)
          const year =
            trainingYear[trainingYear.length - 1 - i]?.toString() ?? ''
          return (
            <div key={year} className="flex-column w100">
              <h1 className="center-text">
                <Link href={`/training/barcode/${year}`}>{year}</Link>
              </h1>
              <Barcode
                data={yearTraining}
                itemRender={(weeklyTraining, index) => {
                  const barWidth = weeklyTraining.length

                  // Sort week's training by ascending grades
                  const filteredWeeklyTraining = weeklyTraining
                    .filter(training => training !== undefined)
                    .sort(({ sessionType: aType }, { sessionType: bType }) => {
                      if (aType === undefined || bType === undefined) return 0

                      return (
                        convertSessionTypeToSortOrder(bType) -
                        convertSessionTypeToSortOrder(aType)
                      )
                    })

                  // Colorize bars
                  const backgroundGradient =
                    weeklyTraining.length === 1
                      ? convertSessionTypeToBackgroundColor(
                          weeklyTraining[0]?.sessionType,
                        ).toString()
                      : `linear-gradient(${filteredWeeklyTraining
                          .map(training =>
                            convertSessionTypeToBackgroundColor(
                              training?.sessionType,
                            ),
                          )
                          .join(', ')})`

                  return (
                    <span
                      key={(
                        filteredWeeklyTraining[0]?.date ?? index
                      ).toString()}
                      style={{
                        display: 'block',
                        blockSize: '100%',
                        width: barWidth,
                        maxWidth: maxBarWidth,
                        background: backgroundGradient,
                      }}
                      title={createTrainingBarCodeTooltip(
                        filteredWeeklyTraining,
                      )}
                    />
                  )
                }}
              />
            </div>
          )
        })
        .reverse()}
    </section>
  )
}
