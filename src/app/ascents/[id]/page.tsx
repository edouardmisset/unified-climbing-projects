import type { Metadata } from 'next'
import { AscentCard } from '~/app/_components/ascent-card/ascent-card'
import { isError } from '~/helpers/is-error'
import { api } from '~/trpc/server'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const _id = (await params)?.id ?? ''
  if (_id.length === 0) return <h2>Invalid ascent ID</h2>

  const ascent = await api.ascents.getById({ _id })

  if (isError(ascent)) {
    return <div>{ascent.error}</div>
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
