import Image from 'next/image'
import QRCode from '~/app/_components/qr-code/qr-code'
import { convertGradeToColor } from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentTooltip } from '~/helpers/tooltips'
import { seasonAscent } from '~/data/ascent-data'
import styles from './page.module.css'
import Link from 'next/link'

export default function Page() {
  return (
    <main className={styles.main}>
      <section style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ textAlign: 'center' }}>Ascents</h2>
        <div className={styles.grid}>
          {Object.entries(seasonAscent)
            .reverse()
            .map(([year, ascents]) => {
              const sortedAscents = [...ascents].map(ascentDay => ({
                ...ascentDay,
                ascents: ascentDay?.ascents
                  ? ascentDay.ascents.sort(sortByDescendingGrade)
                  : undefined,
              }))
              return (
                <div key={year}>
                  <h3 style={{ textAlign: 'center' }}>
                    <Link href={`/qr-code/ascents/${year}`}>{year}</Link>
                  </h3>
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
                              ? createAscentTooltip(ascentDay.ascents)
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
              )
            })}
        </div>
      </section>
    </main>
  )
}
