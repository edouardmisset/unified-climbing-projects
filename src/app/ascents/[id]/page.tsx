import { isValidNumber } from '@edouardmisset/math'
import type { Metadata } from 'next'
import { AscentCard } from '~/app/_components/ascent-card/ascent-card'
import { isError } from '~/helpers/is-error'
import { api } from '~/trpc/server'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params)?.id ?? ''

  const numericId = Number(id)
  if (
    !isValidNumber(numericId) ||
    Number.isInteger(numericId) ||
    numericId <= 0
  ) {
    return <div>Invalid ascent ID: {id}</div>
  }

  const ascent = await api.ascents.getById({ id: numericId })

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
  description: 'Display a climbing ascent',
  keywords: ['climbing', 'ascent', 'details'],
  title: 'Ascent 🧗',
}
