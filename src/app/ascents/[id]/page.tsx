import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import { AscentPage } from './ascent-page'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Loader />}>
      <AscentPage params={params} />
    </Suspense>
  )
}

export const metadata: Metadata = {
  description: 'Display a climbing ascent',
  keywords: ['climbing', 'ascent', 'details'],
  title: 'Ascent 🧗',
}
