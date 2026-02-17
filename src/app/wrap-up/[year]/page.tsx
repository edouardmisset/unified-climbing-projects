import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import type { Metadata } from 'next'
import WrapUp from '~/app/_components/wrap-up/wrap-up'

export default async function Page(props: { params: Promise<{ year: string }> }) {
  const year = validNumberWithFallback((await props.params).year, new Date().getFullYear())

  return <WrapUp year={year} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>
}): Promise<Metadata> {
  const { year = '' } = await params
  return {
    description: `Textual description of all my climbing ascents in ${year}`,
    keywords: ['climbing', 'ascents', 'description', year],
    title: `${year} Climbing wrap Up 🔁`.trim(),
  }
}
