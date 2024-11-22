import QRCode from '~/app/_components/qr-code/qr-code'
import { getSeasonAscentPerDay } from '~/data/ascent-data'
import { convertGradeToBackgroundColor } from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentQRTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const { year } = await props.params

  const ascents = await api.ascents.getAllAscents()

  const selectedAscents = getSeasonAscentPerDay(ascents)[Number(year)]

  if (selectedAscents === undefined)
    return <div>No data found for the year {year}</div>

  const sortedAscents = [...selectedAscents].map(ascentDay => ({
    ...ascentDay,
    ascents: ascentDay?.ascents
      ? ascentDay.ascents.sort(sortByDescendingGrade)
      : undefined,
  }))

  return (
    <section className="flex-column w100">
      <h1 className="section-header">{year}</h1>
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
                    : convertGradeToBackgroundColor(hardestAscent.topoGrade),
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
    </section>
  )
}

export const dynamic = 'force-dynamic'
