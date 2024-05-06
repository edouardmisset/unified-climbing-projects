import { YearGrid } from '~/app/_components/year-grid'

import Link from 'next/link'
import { seasonTraining } from '~/data/training-data'

export default function Visualization({
  params: { year },
}: {
  params: { year: string }
}) {
  const numberYear = Number(year)
  const yearSession = seasonTraining[numberYear]

  const nextYear = numberYear + 1
  const previousYear = numberYear - 1

  if (yearSession === undefined) return <div>Year not found</div>

  return (
    <>
      <div>An overview of my training in {year}</div>
      {yearSession.length === 0 ? (
        <span>No record</span>
      ) : (
        <YearGrid gridContent={yearSession} />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Link href={`./${previousYear}`}>{previousYear}</Link>
        <Link href={`./${nextYear}`}>{nextYear}</Link>
      </div>
    </>
  )
}
