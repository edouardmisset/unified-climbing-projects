import Link from 'next/link'
import QRCode from '~/app/_components/qr-code/qr-code'
import { getSeasonTraining } from '~/data/training-data'
import { convertSessionTypeToBackgroundColor } from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'
import type { TrainingSession } from '~/types/training'

export default async function Page() {
  const trainingSessions = await api.training.getAllTrainingSessions()

  return (
    <section className="flex-column w100 ">
      <div className="qr-grid">
        {Object.entries(getSeasonTraining(trainingSessions))
          .reverse()
          .map(([year, training]) => (
            <div key={year}>
              <h3 className="center-text">
                <Link href={`/training/qr-code/${year}`}>{year}</Link>
              </h3>
              <QRCode
                data={training}
                itemRender={(trainingSession: TrainingSession) => (
                  <i
                    key={
                      String(trainingSession.date.dayOfYear) +
                      trainingSession.date.toString()
                    }
                    style={{
                      backgroundColor: convertSessionTypeToBackgroundColor(
                        trainingSession.sessionType,
                      ).toString(),
                    }}
                    title={createTrainingQRTooltip(trainingSession)}
                  />
                )}
              />
            </div>
          ))}
      </div>
    </section>
  )
}
