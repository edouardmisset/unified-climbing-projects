import QRCode from '~/app/_components/qr-code/qr-code'
import { seasonAscentPerDay } from '~/data/ascent-data'
import { convertGradeToBackgroundColor } from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentQRTooltip } from '~/helpers/tooltips'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const params = await props.params

  const { year } = params

  const selectedAscents = seasonAscentPerDay[Number(year)]

  if (selectedAscents === undefined)
    return <div>No data found for the year {year}</div>

  const sortedAscents = [...selectedAscents].map(ascentDay => ({
    ...ascentDay,
    ascents: ascentDay?.ascents
      ? ascentDay.ascents.sort(sortByDescendingGrade)
      : undefined,
  }))

  return (
    <main className="flex-column">
      <section className="flex-column">
        <div key={year}>
          <h3 className="section-header">{year}</h3>
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
      </section>
    </main>
  )
}

export const dynamic = 'force-dynamic'
