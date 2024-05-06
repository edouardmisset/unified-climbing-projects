import Image from 'next/image'
import Link from 'next/link'
import QRCode from '~/app/_components/qr-code/qr-code'
import type { TrainingSession } from '~/types/training'
import { convertSessionTypeToBackgroundColor } from '~/helpers/converter'
import { createTrainingTooltip } from '~/helpers/tooltips'
import { seasonTraining } from '~/data/training-data'
import styles from './page.module.css'

export default function Page() {
  return (
    <main className={styles.main}>
      <section style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ textAlign: 'center' }}>Training</h2>
        <div className={styles.grid}>
          {Object.entries(seasonTraining)
            .reverse()
            .map(([year, training]) => (
              <div key={year}>
                <h3 style={{ textAlign: 'center' }}>
                  <Link href={`/qr-code/training/${year}`}>{year}</Link>
                </h3>
                <QRCode
                  data={training}
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
                    src="https://em-content.zobj.net/thumbs/120/apple/354/person-climbing_1f9d7.png"
                    width={120}
                    height={120}
                  />
                </QRCode>
              </div>
            ))}
        </div>
      </section>
    </main>
  )
}
