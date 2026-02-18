import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import { AscentDetail } from './ascent-detail'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const _id = (await params)?.id ?? ''
  if (_id.length === 0) return <h2>Invalid ascent ID</h2>

  return (
    <Suspense fallback={<Loader />}>
      <AscentDetail ascentId={_id} />
    </Suspense>
  )
}

export const metadata: Metadata = {
  description: 'Display a climbing ascent',
  keywords: ['climbing', 'ascent', 'details'],
  title: 'Ascent 🧗',
}
