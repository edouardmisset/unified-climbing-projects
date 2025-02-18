import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import { AscentsQRDot } from '~/app/_components/qr-code/ascents-qr-dot.tsx'
import QRCode from '~/app/_components/qr-code/qr-code'
import { getYearAscentPerDay } from '~/data/ascent-data'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { api } from '~/trpc/server'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const year = validNumberWithFallback(
    (await props.params).year,
    new Date().getFullYear(),
  )

  const ascents = await api.ascents.getAllAscents()

  const selectedAscents = getYearAscentPerDay(ascents)[year]

  if (selectedAscents === undefined)
    return <div>No data found for the year {year}</div>

  const sortedAscents = selectedAscents.map(ascent =>
    ascent.toSorted((a, b) => sortByDescendingGrade(a, b)),
  )

  return (
    <section className="flex-column w100 h100 align-center">
      <h1 className="section-header">{year}</h1>
      <QRCode>
        {sortedAscents.map((ascents, index) => (
          <AscentsQRDot ascents={ascents} key={ascents[0]?.date ?? index} />
        ))}
      </QRCode>
    </section>
  )
}

export const dynamic = 'force-dynamic'
