import Image from 'next/image'
import QRCode from '~/app/_components/qr-code/qr-code'
import { convertGradeToColor } from '~/utils/converter'
import { sortByDescendingGrade } from '~/utils/sorter'
import { createAscentQRTooltip } from '~/utils/tooltips'
import { seasonAscent } from '../data'
import styles from './page.module.css'

export default function Page({
  params: { year },
}: {
  params: { year: string }
}) {
  const selectedAscents = seasonAscent[Number(year)]

  if (selectedAscents === undefined) return <div>Year not found</div>

  const sortedAscents = [...selectedAscents].map(ascentDay => ({
    ...ascentDay,
    ascents: ascentDay?.ascents
      ? ascentDay.ascents.sort(sortByDescendingGrade)
      : undefined,
  }))

  return (
    <main className={styles.main}>
      <section style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ textAlign: 'center' }}>Ascents</h2>
        <div className={styles.grid}>
          <div key={year}>
            <h3 style={{ textAlign: 'center' }}>{year}</h3>
            <QRCode
              data={sortedAscents}
              itemRender={ascentDay => {
                const hardestAscent = ascentDay?.ascents?.at(0)
                return (
                  <span
                    key={ascentDay.date.dayOfYear}
                    style={{
                      backgroundColor:
                        hardestAscent === undefined
                          ? 'white'
                          : convertGradeToColor(hardestAscent.topoGrade),
                    }}
                    title={
                      ascentDay?.ascents
                        ? createAscentQRTooltip(ascentDay.ascents)
                        : ''
                    }
                  />
                )
              }}
            >
              <Image
                alt=""
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
