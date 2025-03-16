import type { Metadata } from 'next'
import { AscentCard } from '~/app/_components/ascent-card/ascent-card'
import { isError } from '~/helpers/is-error'
import { api } from '~/trpc/server'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  const ascent = await api.ascents.getById({ id: Number(id) })

  if (isError(ascent)) {
    return <div>{ascent.error}</div>
  }

  return (
    <div className="super-center w100 h100">
      <AscentCard ascent={ascent} />
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Ascent 🧗',
  description: 'View a single climbing ascent',
  keywords: ['climbing', 'ascent', 'details'],
}
