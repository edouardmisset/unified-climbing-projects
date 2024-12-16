import QRCode from '~/app/_components/qr-code/qr-code'
import { getYearAscentPerDay } from '~/data/ascent-data'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { api } from '~/trpc/server'
import { ascentsQRCodeRender } from '../helpers.tsx'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const { year } = await props.params

  const ascents = await api.ascents.getAllAscents()

  const selectedAscents = getYearAscentPerDay(ascents)[Number(year)]

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
      <QRCode data={sortedAscents} itemRender={ascentsQRCodeRender} />
    </section>
  )
}

export const dynamic = 'force-dynamic'
