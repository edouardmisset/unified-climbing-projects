import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AscentCard } from '~/app/_components/ascent-card/ascent-card'
import { Loader } from '~/app/_components/loader/loader'
import { getAscentById } from '~/services/ascents'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const _id = (await params)?.id ?? ''
  if (_id.length === 0) return <h2>Invalid ascent ID</h2>

  return (
    <Suspense fallback={<Loader />}>
      <AscentDetail ascentId={_id} />
    </Suspense>
  )
}

async function AscentDetail({ ascentId }: { ascentId: string }) {
  const ascent = await getAscentById(ascentId)

  if (!ascent) {
    return <p>Ascent not found</p>
  }

  return (
    <div className="superCenter w100 h100">
      <AscentCard ascent={ascent} />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Display a climbing ascent',
  keywords: ['climbing', 'ascent', 'details'],
  title: 'Ascent 🧗',
}
