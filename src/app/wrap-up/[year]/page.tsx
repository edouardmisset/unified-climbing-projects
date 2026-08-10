import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import { YearWrapUp } from './year-wrap-up'

// Runtime-prefetch review: assess with the user whether URL data should resolve before click.
// See: https://nextjs.org/docs/app/guides/runtime-prefetching
export default function Page({ params }: { params: Promise<{ year: string }> }) {
  return (
    <Suspense fallback={<Loader />}>
      <YearWrapUp params={params} />
    </Suspense>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>
}): Promise<Metadata> {
  const { year } = await params
  return {
    description: `Textual description of all my climbing ascents in ${year}`,
    keywords: ['climbing', 'ascents', 'description', year],
    title: `${year} Climbing wrap Up 🔁`.trim(),
  }
}
