import Image from 'next/image'
import QRCode from '~/app/_components/qr-code/qr-code'
import type { TrainingSession } from '~/types/training'
import { convertSessionTypeToBackgroundColor } from '~/helpers/converter'
import { createTrainingTooltip } from '~/helpers/tooltips'
import { seasonTraining } from '~/data/training-data'
import styles from './page.module.css'

export default function Page({
  params: { year },
}: {
  params: { year: string }
}) {
  const selectedTrainingSessions = seasonTraining[Number(year)]

  if (selectedTrainingSessions === undefined)
    return <div>No data found for the year {year}</div>

  return (
    <main className={styles.main}>
      <section style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ textAlign: 'center' }}>Training</h2>
        <div className={styles.grid}>
          <div key={year}>
            <h3 style={{ textAlign: 'center' }}>{year}</h3>
            <QRCode
              data={selectedTrainingSessions}
              itemRender={(trainingSession: TrainingSession) => (
                <i
                  key={trainingSession.date.dayOfYear}
                  style={{
                    backgroundColor: convertSessionTypeToBackgroundColor(
                      trainingSession.sessionType,
                    ).toString(),
                  }}
                  title={createTrainingTooltip(trainingSession)}
                />
              )}
            >
              <Image
                alt=""
                priority
                src="https://em-content.zobj.net/thumbs/120/apple/354/person-climbing_1f9d7.png"
                width={120}
                height={120}
              />
            </QRCode>
          </div>
        </div>
      </section>
    </main>
  )
}
