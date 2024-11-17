import Link from 'next/link'
import QRCode from '~/app/_components/qr-code/qr-code'
import { seasonAscentPerDay } from '~/data/ascent-data'
import { convertGradeToBackgroundColor } from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentQRTooltip } from '~/helpers/tooltips'

export default function Page() {
  return (
    <main className="flex-column">
      <section className="flex-column">
        <h2 className="center-text">Ascents</h2>
        <div className="qr-grid">
          {Object.entries(seasonAscentPerDay)
            .reverse()
            .map(([year, ascents]) => {
              const sortedAscents = [...ascents].map(ascentDay => ({
                ...ascentDay,
                ascents: ascentDay?.ascents
                  ? ascentDay.ascents.sort(sortByDescendingGrade)
                  : undefined,
              }))
              return (
                <div key={`ascents in ${year}`}>
                  <h3 className="center-text">
                    <Link href={`/ascents/qr-code/${year}`}>{year}</Link>
                  </h3>
                  <QRCode
                    data={sortedAscents}
                    itemRender={ascentDay => {
                      const hardestAscent = ascentDay?.ascents?.at(0)
                      return (
                        <i
                          key={
                            String(ascentDay.date.dayOfYear) +
                            ascentDay.ascents?.[0]?.routeName
                          }
                          style={{
                            backgroundColor:
                              hardestAscent === undefined
                                ? 'white'
                                : convertGradeToBackgroundColor(
                                    hardestAscent.topoGrade,
                                  ),
                          }}
                          title={
                            ascentDay?.ascents
                              ? createAscentQRTooltip(ascentDay.ascents)
                              : ''
                          }
                        />
                      )
                    }}
                  />
                </div>
              )
            })}
        </div>
      </section>
    </main>
  )
}
