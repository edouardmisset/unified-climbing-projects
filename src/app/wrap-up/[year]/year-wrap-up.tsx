import { validNumberWithFallback } from '@edouardmisset/math'
import { io } from 'next/cache'
import WrapUp from '~/app/_components/wrap-up/wrap-up'

export async function YearWrapUp({
  homePath,
  params,
}: {
  homePath?: string
  params: Promise<{ year: string }>
}) {
  const awaitedParams = await params
  await io()
  const year = validNumberWithFallback(awaitedParams.year, new Date().getFullYear())

  return <WrapUp homePath={homePath} year={year} />
}
