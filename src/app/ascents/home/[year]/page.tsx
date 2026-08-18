import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import { YearWrapUp } from '~/app/wrap-up/[year]/year-wrap-up'

export default function AscentsYearHomePage({ params }: { params: Promise<{ year: string }> }) {
  return (
    <Suspense fallback={<Loader />}>
      <YearWrapUp homePath='/ascents/home' params={params} />
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: 'Home · Ascents',
}
