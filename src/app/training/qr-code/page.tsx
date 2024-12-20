import { Link } from 'next-view-transitions'
import QRCode from '~/app/_components/qr-code/qr-code'
import { getYearTraining } from '~/data/training-data'
import { api } from '~/trpc/server'
import { trainingSessionsQRCodeRender } from './helpers.tsx'

export default async function Page() {
  const trainingSessions = await api.training.getAllTrainingSessions()

  return (
    <section className="flex-column w100 ">
      <div className="qr-grid">
        {Object.entries(getYearTraining(trainingSessions))
          .reverse()
          .map(([year, training]) => (
            <div key={year}>
              <h3 className="center-text">
                <Link href={`/training/qr-code/${year}`}>{year}</Link>
              </h3>
              <QRCode
                data={training}
                itemRender={trainingSessionsQRCodeRender}
              />
            </div>
          ))}
      </div>
    </section>
  )
}
