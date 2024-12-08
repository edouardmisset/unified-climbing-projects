import Link from 'next/link'
import QRCode from '~/app/_components/qr-code/qr-code'
import { getYearAscentPerDay } from '~/data/ascent-data'
import { convertGradeToBackgroundColor } from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentsQRTooltip } from '~/helpers/tooltips'
import { parseISODateToTemporal } from '~/schema/ascent'
import { api } from '~/trpc/server'

export default async function Page() {
  const ascents = await api.ascents.getAllAscents()
  return (
    <section className="flex-column w100">
      <h1 className="center-text">Ascents</h1>
      <div className="qr-grid">
        {Object.entries(getYearAscentPerDay(ascents))
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
                <h2 className="center-text">
                  <Link href={`/ascents/qr-code/${year}`}>{year}</Link>
                </h2>
                <QRCode
                  data={sortedAscents}
                  itemRender={ascentDay => {
                    const hardestAscent = ascentDay?.ascents?.at(0)
                    return (
                      <i
                        key={
                          String(
                            parseISODateToTemporal(ascentDay.date).dayOfYear,
                          ) + ascentDay.ascents?.[0]?.routeName
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
                            ? createAscentsQRTooltip(ascentDay.ascents)
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
  )
}
