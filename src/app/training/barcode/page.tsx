import Link from 'next/link'
import Barcode, { maxBarWidth } from '~/app/_components/barcode/barcode'
import { ascentSeasons as trainingYear } from '~/data/ascent-data'
import { seasonsTrainingPerWeek } from '~/data/training-data'
import { convertSessionTypeToBackgroundColor } from '~/helpers/converter'
import { convertSessionTypeToSortOrder } from '~/helpers/sorter'
import { createTrainingBarCodeTooltip } from '~/helpers/tooltips'

export default function Page() {
  return (
    <main
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1rem',
      }}
    >
      {Object.values(seasonsTrainingPerWeek)
        .map((seasonTraining, i) => {
          const year =
            trainingYear[trainingYear.length - 1 - i]?.toString() ?? ''
          return (
            <div key={year} className="flex-column">
              <h3 className="center-text">
                <Link href={`/training/barcode/${year}`}>{year}</Link>
              </h3>
              <Barcode
                data={seasonTraining}
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
                        height: '100%',
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
    </main>
  )
}
