import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import WrapUp from '~/app/_components/wrap-up/wrap-up'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const year = validNumberWithFallback(
    (await props.params).year,
    new Date().getFullYear(),
  )

  return <WrapUp year={year} />
}
