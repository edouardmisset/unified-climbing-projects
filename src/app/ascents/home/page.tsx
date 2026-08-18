import type { Metadata } from 'next'
import WrapUp from '~/app/_components/wrap-up/wrap-up'

export default function AscentsHomePage() {
  return <WrapUp homePath='/ascents/home' />
}

export const metadata: Metadata = {
  description: 'Review your climbing year.',
  title: 'Home · Ascents',
}
